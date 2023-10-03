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

      // Create a reference to the "uploads" collection
      const uploadsCollection = collection(db, 'uploads');

      // Create a query to order uploads by timestamp
      const uploadsQuery = query(
        uploadsCollection,
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
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, 'uploads/' + file.name);
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
        () => {
          // File uploaded successfully, now get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);

            // Save the download URL to Firestore or perform any other action
            // Example:
            db.collection('uploads').add({
              fileName: file.name,
              downloadURL: downloadURL,
              timestamp: new Date(),
            });

            // Clear the file input
            setFile(null);
          });
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
          {uploadedFiles.map((file) => (
            <li key={file.id}>{file.fileName}</li>
          ))}
        </ul>
      </div>
      {/* Other dashboard content */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
