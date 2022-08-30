import { toast } from "@chakra-ui/react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword
} from "firebase/auth";
import {
  getFirestore,
  doc,
  addDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  setDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYGm8vhfc9ape8U5Tei_KLKM2Uu61kSgI",
  authDomain: "tap-app-bc5ba.firebaseapp.com",
  projectId: "tap-app-bc5ba",
  storageBucket: "tap-app-bc5ba.appspot.com",
  messagingSenderId: "541187872613",
  appId: "1:541187872613:web:dbc37b36f04ee96f17338c",
  measurementId: "G-T6V9S2Y70J",
};

//Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

const auth = getAuth(app);

//auth functions
const signInWithGoogle = () => signInWithPopup(auth, provider);

const signIn = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

const signUp = async (email, password) => {
  try {
    //register user
    let { user } = await createUserWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
  }
};

const signMeOut = () => {
  signOut(auth);
};

const registerUserWithDevice = async (email, password, code, deviceId) => {
  const deviceRef = doc(db, "device_links", deviceId);
  let device = await getDoc(deviceRef);
  if (!device.exists()) {
    return { error: "Device does not exist" };
  }
  //    console.log(device.data());
  if (device.data().code != code) {
    return { error: "Invalid code" };
  }

  //check if user is already registered
  let userProfileCheck = await getDocs(
    query(collection(db, "user_profiles"), where("email", "==", email))
  );
  let userProfileCheckData = [];
  userProfileCheck.forEach((user) => {
    userProfileCheckData.push({ uid: user.data().user_id, ...user.data() });
  });

  if (userProfileCheckData.length > 0) {
    var user = userProfileCheckData[0];
  } else {
    //register new user
    var { user } = await createUserWithEmailAndPassword(auth, email, password);
    //create new doc in user_profiles collection
    let userProfile = await addDoc(collection(db, "user_profiles"), {
      user_id: user.uid,
      email: email,
      name: "",
      avatar: "",
    });
  }

  //update device links with user id
  await setDoc(
    deviceRef,
    { user_id: user.uid, date_registered_at: +new Date() },
    { merge: true }
  );

  return { success: "Successfully registered", error: false };
};

const isDeviceRegistered = async (deviceId) => {
  let device = await getDoc(doc(db, "device_links", deviceId));
  if (device.exists()) {
    if (device.data().user_id != "") {
      return true;
    } else {
      return false;
    }
  } else {
    throw new Error("Device does not exist");
  }
};

//device specific functions

const getDevicesForUser = async (userId) => {
  let devices = await getDocs(
    query(collection(db, "device_links"), where("user_id", "==", userId))
  );
  let devicesData = [];
  for (let i = 0; i < devices.size; i++) {
    let d = devices.docs[i];
    //get device type for device
    let deviceType = await getDoc(
      doc(db, "device_types", d.data().device_type_id)
    );

    let deviceTypeData = { id: deviceType.id, ...deviceType.data() };

    devicesData.push({ id: d.id, device_type: deviceTypeData, ...d.data() });
  }
  return devicesData;
};

const getDeviceData = async (id) => {
  let deviceDataRef = doc(db, "device_links", id);
  let deviceData = await getDoc(deviceDataRef);

  //get device type for device
  let deviceType = await getDoc(
    doc(db, "device_types", deviceData.data().device_type_id)
  );
  let deviceTypeData = { id: deviceType.id, ...deviceType.data() };

  return {
    id: deviceData.id,
    device_type: deviceTypeData,
    ...deviceData.data(),
  };
};

const getSocialsForDevice = async (deviceId, userId) => {
  // console.log(deviceId, userId)
  const socialsRef = collection(db, "socials");
  const q = query(socialsRef, where("device_link_id", "==", deviceId));
  const querySnapshot = await getDocs(q);
  let socials = [];
  querySnapshot.forEach((doc) => {
    socials.push({ id: doc.id, ...doc.data() });
  });

  return socials;
};

const updateDeviceData = async (id, data) => {
  if (!data) {
    return;
  }
  try {
    let deviceDataRef = doc(db, "device_links", id);
    if (!data?.is_edited) {
      data.is_edited = true;
    }
    let { device_type, ...rest } = data;
    let updatedDevice = await setDoc(deviceDataRef, rest, { merge: true });
  } catch (err) {
    console.log(err);
  }
};

const uploadImage = async (folder, file, deviceLinkId) => {
  // console.log(file, deviceLinkId)
  if (!file) {
    throw new Error('need a file')
    return
  }
  if (!folder) {
    throw new Error('need a folder name')
    return
  }
  if (file.type.split("/")[0] !== "image") {
    throw new Error("Invalid file type");
  }
  let ext = "." + file.name.split(".").pop();
  const imageRef = ref(storage, `${folder}/${deviceLinkId + ext}`);
  const uploadSnapshot = await uploadBytes(imageRef, file);
  let uploadUrl = getDownloadURL(uploadSnapshot.ref);
  return uploadUrl;
};

//socials functions

const updateSocial = async (id, obj) => {
  let socialRef = doc(db, "socials", id);
  let { social_type_id, ...rest } = obj;
  let updatedSocial = await setDoc(socialRef, rest, { merge: true });
};

const addSocial = async (obj) => {
  let newSocial = await addDoc(collection(db, "socials"), obj);
  let newSocialRef = doc(db, "socials", newSocial.id);
  let newSocialData = await getDoc(newSocialRef);
  return { id: newSocialData.id, ...newSocialData.data() };
};

const deleteSocial = async (id) => {
  let socialRef = doc(db, "socials", id);
  await deleteDoc(socialRef);
};

//device visits functions

const addDeviceVisitEntry = async (deviceId, userId) => {
  let newDeviceVisit = await addDoc(collection(db, "device_visits"), {
    device_link_id: deviceId,
    user_id: userId,
    timestamp: serverTimestamp(),
    //timestamp: +new Date()
  });
};

//user profile functions

const getUserProfile = async (userId) => {
  let userProfile = await getDocs(
    query(collection(db, "user_profiles"), where("user_id", "==", userId))
  );
  let userProfileData = [];
  userProfile.forEach((user) => {
    userProfileData.push({ uid: user.id, ...user.data() });
  });
  return userProfileData[0];
};

const updateUserProfile = async (userId, obj) => {
  let userProfileRef = doc(db, "user_profiles", userId);
  let {uid, ...rest} = obj
  let updatedUserProfile = await setDoc(userProfileRef, rest, { merge: true });
}

const uploadProfileAvatar = async (file, userProfileId) => {
  // console.log(file, deviceLinkId)
  if (!file) return;
  if (file.type.split("/")[0] !== "image") {
    throw new Error("Invalid file type");
  }
  let ext = "." + file.name.split(".").pop();
  const avatarRef = ref(storage, `profile_avatars/${userProfileId + ext}`);
  const uploadSnapshot = await uploadBytes(avatarRef, file);
  let uploadUrl = getDownloadURL(uploadSnapshot.ref);
  return uploadUrl;
};

const updateUserPassword = async (userId, email, currPassword, newPassword) => {
  let credential = EmailAuthProvider.credential(email, currPassword);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await updatePassword(auth.currentUser, newPassword);
}

export {
  signMeOut,
  signIn,
  signUp,
  signInWithGoogle,
  db,
  auth,
  isDeviceRegistered,
  registerUserWithDevice,
  getDevicesForUser,
  getDeviceData,
  getSocialsForDevice,
  updateDeviceData,
  uploadImage,
  updateSocial,
  addSocial,
  deleteSocial,
  addDeviceVisitEntry,
  getUserProfile,
  uploadProfileAvatar,
  updateUserProfile,
  updateUserPassword
};
