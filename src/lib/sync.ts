import { db } from './db';
import { firestore, auth } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { SyncQueueItem } from '@/types/common';

export async function addToSyncQueue(operation: 'set' | 'update' | 'delete', collectionPath: string, docId: string, data: any) {
  try {
    const item: SyncQueueItem = {
      id: crypto.randomUUID(),
      operation,
      collection: collectionPath,
      docId,
      data,
      createdAt: Date.now(),
      retries: 0
    };
    await db.syncQueue.add(item);
    // Try immediate sync, but don't block
    processSyncQueue().catch(() => {});
  } catch (error) {
    // Silently fail — offline mode should not break the app
    console.warn('Sync queue add failed (offline?):', error);
  }
}

export async function processSyncQueue() {
  if (typeof window !== 'undefined' && !navigator.onLine) return;

  // Use auth.currentUser synchronously — it's available after onAuthStateChanged fires
  const user = auth.currentUser;
  if (!user) return;

  const items = await db.syncQueue.toArray();
  if (items.length === 0) return;

  for (const item of items) {
    try {
      const docRef = doc(firestore, item.collection, item.docId);
      
      if (item.operation === 'delete') {
        // Handle delete if needed
      } else {
        await setDoc(docRef, { ...item.data, updatedAt: Date.now() }, { merge: true });
      }
      
      await db.syncQueue.delete(item.id);
    } catch (error) {
      console.error('Sync failed for item:', item.id, error);
      if (item.retries < 5) {
        await db.syncQueue.update(item.id, { retries: item.retries + 1 });
      } else {
        // Give up after 5 retries
        await db.syncQueue.delete(item.id);
      }
    }
  }
}

export async function syncFromRemote(uid?: string) {
  if (typeof window !== 'undefined' && !navigator.onLine) return;
  
  const userId = uid || auth.currentUser?.uid;
  if (!userId) return;
  
  try {
    // Sync profile
    const profileRef = doc(firestore, 'users', userId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      const remoteProfile = profileSnap.data();
      const localProfile = await db.userProfile.get(remoteProfile.id);
      if (!localProfile || remoteProfile.updatedAt > localProfile.updatedAt) {
        await db.userProfile.put(remoteProfile as any);
      }
    }

    // Sync journey steps
    const stepsRef = collection(firestore, 'users', userId, 'journeySteps');
    const stepsSnap = await getDocs(stepsRef);
    for (const docSnap of stepsSnap.docs) {
      const remoteStep = docSnap.data();
      const localStep = await db.journeySteps.get(remoteStep.id);
      if (!localStep || remoteStep.updatedAt > localStep.updatedAt) {
        await db.journeySteps.put(remoteStep as any);
      }
    }
  } catch (error) {
    console.warn('Remote sync failed (offline?):', error);
  }
}

// Listen for reconnection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    processSyncQueue().catch(() => {});
  });
}
