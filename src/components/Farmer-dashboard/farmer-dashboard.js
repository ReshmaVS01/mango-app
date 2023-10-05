import './farmer-dashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../../firebase'; // Import the Firebase auth, Firestore, and Storage instances
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  where, // Import the 'where' function
} from 'firebase/firestore'; // Import Firestore functions
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'; // Import Firebase Storage functions

const Dashboard = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;

  // Check if a user is authenticated
  const isAuthenticated = currentUser !== null;

  // Access user details (if authenticated)
  const displayName = isAuthenticated ? currentUser.displayName : 'Guest';

  // State for storing activities
  const [activities, setActivities] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to the login page
      navigate('/farmerlogin');
    } else {
      // Get the current user's UID
      const userId = currentUser.uid;

      // Create a reference to the "activities" collection
      const activitiesCollection = collection(
        db,
        'farmers',
        userId,
        'activities'
      );

      // Create a query to order activities by timestamp
      const q = query(
        activitiesCollection,
        orderBy('timestamp', 'desc')
      );

      // Listen for real-time updates to the activities
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const updatedActivities = [];
        querySnapshot.forEach((doc) => {
          updatedActivities.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setActivities(updatedActivities);
      });

      // Create a reference to the user's folder in Storage
      const userStorageRef = ref(storage, `uploads/${userId}`);

      // Create a query to order uploads by timestamp and filter by user ID
      const uploadsQuery = query(
        collection(db, 'uploads'),
        where('userId', '==', userId), // Filter by the current user's UID
        orderBy('timestamp', 'desc')
      );

      // Listen for real-time updates to the uploaded files
      const uploadsUnsubscribe = onSnapshot(uploadsQuery, (querySnapshot) => {
        const updatedFiles = [];
        querySnapshot.forEach((doc) => {
          updatedFiles.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log('Updated Files:', updatedFiles); // Add this line
        setUploadedFiles(updatedFiles);
      });

      // Clean up the listeners when the component unmounts
      return () => {
        unsubscribe();
        uploadsUnsubscribe();
      };
    }
  }, [navigate, isAuthenticated, currentUser]);

  const handleLogout = async () => {
    try {
      // Use Firebase's signOut method to log out the user
      await auth.signOut();

      // Redirect the user to the login page
      navigate('/farmerlogin');
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle logout errors, display an error message, etc.
    }
  };

  const handleSubmitActivity = async (e) => {
    e.preventDefault();

    const activity = e.target.activity.value;

    if (!activity) {
      return; // Do not add empty activities
    }

    try {
      // Check if the user is authenticated
      if (!currentUser) {
        console.log('User not authenticated');
        return;
      }

      // Get the current user's ID
      const userId = currentUser.uid;

      // Create a reference to the "activities" collection
      const activitiesCollection = collection(
        db,
        'farmers',
        userId,
        'activities'
      );

      // Add the activity to Firestore under the user's details
      await addDoc(activitiesCollection, {
        activity: activity,
        timestamp: new Date(),
      });

      // Clear the input field
      e.target.activity.value = '';

      console.log('Activity added successfully!');
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      console.log('No file selected.');
      return;
    }
  
    try {
      // Upload the file to the user's folder in Firebase Storage
      const storageRef = ref(storage, `uploads/${currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can track the upload progress here if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error uploading file:', error);
        },
        async () => { // Use async here
          // File uploaded successfully, now get the download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);
  
          // Save the download URL to Firestore with user-specific data
          try {
            await addDoc(collection(db, 'uploads'), {
              fileName: file.name,
              downloadURL: downloadURL,
              timestamp: new Date(),
              userId: currentUser.uid,
            })
            console.log('Document added successfully!');
          } catch (error) {
            console.error('Error adding document:', error);
          }
  
          // Clear the file input
          setFile(null);
        }
      );
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  
  return (
    <div>
      <h2>Welcome, {displayName}!</h2>
      <form onSubmit={handleSubmitActivity}>
        <div>
          <label htmlFor="activity">Add Activity:</label>
          <input type="text" id="activity" required />
          <button type="submit">Submit</button>
        </div>
      </form>
      <form>
        <div>
          <label htmlFor="file">Upload File:</label>
          <input
            type="file"
            id="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={handleFileChange}
          />
          <button type="button" onClick={handleFileUpload}>
            Upload
          </button>
        </div>
      </form>
      {/* Display uploaded activities */}
      <div>
        <h3>Uploaded Activities</h3>
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>{activity.activity}</li>
          ))}
        </ul>
      </div>
      {/* Display uploaded files */}
      <div>
  <h3>Uploaded Files</h3>
  <ul>
    {uploadedFiles.length === 0 ? (
      <p>No files uploaded yet.</p>
    ) : (
      uploadedFiles.map((file) => (
        <li key={file.id}>
          {file.fileName} -{' '}
          <a href={file.downloadURL} target="_blank" rel="noopener noreferrer">
            Download
          </a>
        </li>
      ))
    )}
  </ul>
</div>

      {/* Other dashboard content */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
