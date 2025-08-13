// js/tapes.js
import { db } from "./firebase.js";
import {
  collection, addDoc, getDocs, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== Локальные кассеты (14 шт.) =====
export const tapes = [
  {
    img: "img/tape0001.png",
    title: "Human Tetris — Sailor",
    desc: "A cozy, bittersweet memory of a rainy evening.",
    mini: "Rainy",
    category: "overcast",
    spotify: "https://open.spotify.com/embed/track/2pfPlpXMyvscsmbBwqqDQD"
  },
  {
    img: "img/tape0002.png",
    title: "SALES — Thurs 6-25",
    desc: "The song I listen to when I'm tired and want to slow down.",
    mini: "Slow",
    category: "midnight",
    spotify: "https://open.spotify.com/embed/track/2QS6I5bduBeBnGmJVXbPwe"
  },
  {
    img: "img/tape0003.png",
    title: "Aaron Smith — Dancin (Krono Remix)",
    desc: "An instant mood booster. For good vibes and moving memories.",
    mini: "Dance",
    category: "sunbeam",
    spotify: "https://open.spotify.com/embed/track/6WkJ2OK163XXS2oARUC9JM"
  },
  {
    img: "img/tape0004.png",
    title: "Radiohead — Jigsaw Falling Into Place",
    desc: "One of my favorite songs. Every listen gives me goosebumps.",
    mini: "Chills",
    category: "overcast",
    spotify: "https://open.spotify.com/embed/track/0YJ9FWWHn9EfnN0lHwbzvV"
  },
  {
    img: "img/tape0005.png",
    title: "Kendrick Lamar — Money Trees",
    desc: "This one powers me up. Motivation on repeat.",
    mini: "Hustle",
    category: "sunbeam",
    spotify: "https://open.spotify.com/embed/track/74tLlkN3rgVzRqQJgPfink"
  },
  {
    img: "img/tape0006.png",
    title: "B.J. Thomas — Raindrops Keep Fallin’ On My Head",
    desc: "Helps me keep going through hard times.",
    mini: "Cheerful",
    category: "midnight",
    spotify: "https://open.spotify.com/embed/track/0sKymIftfpTNp62P4oTvTY"
  },
  {
    img: "img/tape0007.png",
    title: "The Strokes — Last Nite",
    desc: "Late night walks and youthful energy.",
    mini: "Young",
    category: "sunbeam",
    spotify: "https://open.spotify.com/embed/track/7kzKAuUzOITUauHAhoMoxA"
  },
  {
    img: "img/tape0008.png",
    title: "Imagine Dragons — Dream",
    desc: "I listened to this song at a time when my life completely changed.",
    mini: "Change",
    category: "overcast",
    spotify: "https://open.spotify.com/embed/track/6S91KdGvAQdUU8vNpqIte7"
  },
  {
    img: "img/tape0009.png",
    title: "sweet steez — Venture",
    desc: "Made to help the sleepy vibes stay strong. It’s about relaxation — nothing to really distract, something to play and just drift away.",
    mini: "Drift",
    category: "midnight",
    spotify: "https://open.spotify.com/embed/track/2Xrlvcmy0r1UMWCj7eYVRi"
  },
  {
    img: "img/tape0010.png",
    title: '“Belle” (Notre-Dame de Paris)',
    desc: "Just the most beautiful story in the world.",
    mini: "Beauty",
    category: "overcast",
    spotify: "https://open.spotify.com/embed/track/7fLWUJpyNbEfrLFKLo8ymN"
  },
  {
    img: "img/tape0011.png",
    title: "Human Tetris — Cold Wind",
    desc: "A pleasant sadness.",
    mini: "Lush",
    category: "overcast",
    spotify: "https://open.spotify.com/embed/track/0nnEw8ftpFYR05STqELNTp"
  },
  {
    img: "img/tape0012.png",
    title: "Placebo — Pierrot the Clown",
    desc: "Relaxing and takes me back to my teenage years.",
    mini: "Nostalgia",
    category: "midnight",
    spotify: "https://open.spotify.com/embed/track/0YYsLGK2PPWx57CFdBUJJg"
  },
  {
    img: "img/tape0013.png",
    title: "The Verve — Drugs Don’t Work",
    desc: "Apathy and sadness, but in a way that you don’t want to leave.",
    mini: "Hollow",
    category: "midnight",
    spotify: "https://open.spotify.com/embed/track/15kLz0zNFdtsaJdXKSGmTU"
  },
  {
    img: "img/tape0014.png",
    title: "2 young — Stop Light",
    desc: "A carefree time: sitting by the shore at night on a noisy promenade, after a work shift, and everything feels good.",
    mini: "Carefree",
    category: "sunbeam",
    spotify: "https://open.spotify.com/embed/track/1JGwBWiSPVfTTpP5N5frel"
  }
];

// --- Исправлено: экспортируем firestoreTapes, он всегда актуальный для getAllTapes
export let firestoreTapes = [];

export async function loadFirestoreTapes() {
  firestoreTapes.length = 0; // очищаем, а не пересоздаём!
  const snapshot = await getDocs(collection(db, "tapes"));
  snapshot.forEach(docSnap => {
    firestoreTapes.push({ ...docSnap.data(), id: docSnap.id });
  });
  return firestoreTapes;
}

export function getAllTapes(category = "all") {
  const all = tapes.concat(firestoreTapes);
  if (category === "all") return all;
  return all.filter(t => t.category === category);
}

export async function addTape(data) {
  await addDoc(collection(db, "tapes"), data);
}

export async function deleteTape(id) {
  await deleteDoc(doc(db, "tapes", id));
}