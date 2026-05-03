import { doc, setDoc, getDocs, collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore, auth } from './firebase';

export async function saveJourneyStep(stepId: string, title: string, completed: boolean): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) return;
    
    await setDoc(
      doc(firestore, 'users', user.uid, 'journeySteps', stepId),
      {
        completed,
        completedAt: Timestamp.now(),
        stepTitle: title
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Firestore saveJourneyStep error:', error);
  }
}

export async function saveChecklistItem(itemId: string, checked: boolean): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) return;
    
    await setDoc(
      doc(firestore, 'users', user.uid, 'checklists', itemId),
      {
        checked,
        updatedAt: Timestamp.now()
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Firestore saveChecklistItem error:', error);
  }
}

export async function saveAIQuery(query: string, response: object): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) return;
    
    await addDoc(
      collection(firestore, 'users', user.uid, 'aiHistory'),
      {
        query,
        response,
        askedAt: Timestamp.now()
      }
    );
  } catch (error) {
    console.error('Firestore saveAIQuery error:', error);
  }
}

export async function fetchUserProgress() {
  try {
    const user = auth.currentUser;
    if (!user) return { savedSteps: [], savedChecks: [] };
    
    // Read journey steps
    const stepsSnap = await getDocs(collection(firestore, 'users', user.uid, 'journeySteps'));
    const savedSteps = stepsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Read checklists
    const checksSnap = await getDocs(collection(firestore, 'users', user.uid, 'checklists'));
    const savedChecks = checksSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return { savedSteps, savedChecks };
  } catch (error) {
    console.error('Firestore read error:', error);
    return { savedSteps: [], savedChecks: [] };
  }
}
