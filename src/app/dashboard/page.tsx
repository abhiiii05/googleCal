"use client"

import getDb from "../../../functions/getDb";
import {useEffect, useState} from "react";
import {getAuth, getRedirectResult, GoogleAuthProvider} from "firebase/auth";
import getFirebase from "../../../functions/getFirebase";
import {redirect} from "next/navigation";
import {bool} from "prop-types";

let flag = false;

export default function Dashboard() {
    const firebase = getFirebase()
    const auth = getAuth(firebase)
    const db = getDb();

    let [email, setEmail] = useState(localStorage.getItem('email'));
    
    useEffect(() => {
        getRedirectResult(auth)
            .then((result) => {
                if (result) {
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    if(credential?.accessToken) {
                        localStorage.setItem("token", credential.accessToken)
                    }
                    const user = result.user;
                    if (user.email) {
                        localStorage.setItem('email', user.email);
                        setEmail(user.email);
                    }
                    console.log(user)
                }
            }).catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage)
        });

        if ((localStorage.getItem('redirect') != "true") && (!email) && (!flag)) {
            console.log('YEA', localStorage.getItem('redirect'));
            redirect('/login');
        }

        if (!flag) {
            flag = true
        }

        localStorage.setItem("redirect", "false")
    }, [])
}