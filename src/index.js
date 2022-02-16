import {initializeApp} from 'firebase/app'
import {
    getFirestore,collection,onSnapshot,
    addDoc,deleteDoc,doc,
    query,
    orderBy,serverTimestamp,
    getDoc,updateDoc,
} from 'firebase/firestore'
import{
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
}from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDaohwGbM1Bl3Qn3ck2s54KOc9xpVksPpE",
    authDomain: "project-firebase-9.firebaseapp.com",
    projectId: "project-firebase-9",
    storageBucket: "project-firebase-9.appspot.com",
    messagingSenderId: "18107714644",
    appId: "1:18107714644:web:f31668f02692e26052b1c1"
  }
// init firebase app
  initializeApp(firebaseConfig)

//   init service
const db = getFirestore()
const auth = getAuth()

// collection Ref
const colRef = collection(db,'books')

// queries
const q = query (colRef , orderBy('created_at'))

// real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach(doc => {
        books.push({...doc.data(), id: doc.id})
    })
    console.log(books)
})


// adding document
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit' , e =>{
    e.preventDefault()
    addDoc(colRef,{
        title: addBookForm.title.value.trim(),
        author: addBookForm.author.value.trim(),
        created_at : serverTimestamp()
    })
    .then(()=>{
        addBookForm.reset() 
    })
})

// deleting document
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', e => {
    e.preventDefault()
   const docRef = doc(db , 'books', deleteBookForm.id.value)
   deleteDoc(docRef)
   .then(()=>{
    deleteBookForm.reset()
})
})


// get a single document
const docRef = doc(db ,'books', 'CcSXHj5hbBaKocwoNTE6')

const unsubDoc = onSnapshot(docRef , (doc) =>{
    console.log(doc.data(),doc.id)
})


// updating document
const updateBookForm = document.querySelector('.update')
updateBookForm.addEventListener('submit', e => {
    e.preventDefault()
    const docRef = doc(db , 'books', updateBookForm.id.value)
    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateBookForm.reset()
    })
})


// signing users up
const signUpForm = document.querySelector('.signup')
signUpForm.addEventListener('submit', e =>{
    e.preventDefault()

    const email = signUpForm.email.value.trim()
    const password = signUpForm.password.value.trim()
    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log('user created:' , cred.user)
        signUpForm.reset()
    }).catch((err) => {
        console.log('Password should be at least 6 characters')
    })
})


// login and logout
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click' , () => {
    signOut(auth)
    .then(()=> {
        // console.log('the user signed out')
    }).catch((err) => {
        console.log(err.message)
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit' , e => {
    e.preventDefault()
    const email = loginForm.email.value.trim()
    const password = loginForm.password.value.trim()

    signInWithEmailAndPassword(auth , email, password)
    .then((cred)=>{
        // console.log('user logged in', cred.user)
    }).catch((err)=> {
        console.log(err.message)
    })
})


// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth ,(user) => {
    console.log('user status change', user)

})

// unsubscribing from changes
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubCol()
    unsubDoc()
    unsubAuth()
})