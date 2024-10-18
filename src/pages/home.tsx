import { Button } from "@/components/ui/button";
import {auth} from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";


function Home() {
  const logout = () => {
    auth.signOut().then(() => {
      window.location.href = "/login";
    });
  };

  interface UserDetails {
    email: string;
    name: string;
  }

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(user);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails({
            email: docSnap.data().email,
            name: docSnap.data().name,
          });
          console.log("userDetails");
          console.log(userDetails);
        } else {
          console.log("No such document!");
        }
      }
    });
    return unsubscribe;
  }, []);
  return (
    <>
      <h1>Home page</h1>
      {userDetails && <h1>Hi, {userDetails.name} you are logged in.</h1>}
        {userDetails && <h1>{userDetails.email}</h1>}
      <Button onClick={logout}>Logout</Button>
    </>
  );
}

export default Home;