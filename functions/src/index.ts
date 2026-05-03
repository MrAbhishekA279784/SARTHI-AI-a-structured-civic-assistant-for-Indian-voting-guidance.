import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const onUserJourneyStepComplete = functions.firestore
  .document('users/{uid}/journeySteps/{stepId}')
  .onWrite(async (change, context) => {
    const { uid } = context.params;
    
    // Calculate overall readiness %
    const snapshot = await db.collection(`users/${uid}/journeySteps`).get();
    let completedCount = 0;
    const totalSteps = snapshot.size;

    snapshot.forEach(doc => {
      if (doc.data().completed) completedCount++;
    });

    const readinessScore = totalSteps === 0 ? 0 : Math.round((completedCount / totalSteps) * 100);

    // Write result to profile
    return db.doc(`users/${uid}/profile/main`).set({
      readinessScore,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

export const onAIQueryLogged = functions.firestore
  .document('users/{uid}/aiHistory/{docId}')
  .onCreate(async (snap, context) => {
    const { uid } = context.params;
    
    const statsRef = db.doc(`users/${uid}/stats/main`);
    
    await db.runTransaction(async (transaction) => {
      const statsDoc = await transaction.get(statsRef);
      let totalQueriesAsked = 1;
      
      if (statsDoc.exists) {
        totalQueriesAsked = (statsDoc.data()?.totalQueriesAsked || 0) + 1;
      }
      
      transaction.set(statsRef, {
        totalQueriesAsked,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      // If totalQueriesAsked reaches 5 -> update badge
      if (totalQueriesAsked >= 5) {
        const profileRef = db.doc(`users/${uid}/profile/main`);
        transaction.set(profileRef, {
          badges: admin.firestore.FieldValue.arrayUnion('active_learner')
        }, { merge: true });
      }
    });
  });

export const scheduledECIDataRefresh = functions.pubsub
  .schedule('every 24 hours')
  .onRun(async (context) => {
    // Ping a status check endpoint / update timestamp
    return db.doc('system/eciData').set({
      lastRefreshed: admin.firestore.FieldValue.serverTimestamp(),
      status: 'active'
    }, { merge: true });
  });
