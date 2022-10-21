import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";

import { createAutocomplete } from "@algolia/autocomplete-core";
// import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";

//import { Input } from "antd";
//import { SearchNormal1 } from "iconsax-react";

import { db } from "../../Firebase.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";

export default function HeaderSearch() {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [autocompleteState, setAutocompleteState] = useState({});
  // const [searchInput, setSearchInput] = useState("");
  const abc = videos.concat(users);

  const [searchHeader, setSearchHeader] = useState(false);

  const inputFocusRef = useRef(null);
  const inputFocusProp = {
    ref: inputFocusRef,
  };

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          setAutocompleteState(state);
        },
        getSources() {
          return [
            {
              sourceId: "pages-source",
              getItemInputValue({ item }) {
                // search item
                return item.query;
              },
              getItems({ query }) {
                // takes your search input and checks if anything that matches it exists in your dataset
                if (!query) {
                  return abc;
                }
                return abc.filter(
                  (item) =>
                    item.VideoTitle?.toLowerCase().includes(
                      query.toLowerCase()
                    ) ||
                    item.Username?.toLowerCase().includes(
                      query.toLocaleLowerCase()
                    )
                );
              },
              // getItemUrl({ item }) {
              //   return item.url;
              // },
              templates: {
                item({ item }) {
                  return item.VideoTitle || item.Username;
                },
              },
            },
          ];
        },
      }),
    []
  );

  function linkHandleClick() {
    autocompleteState.query = "";
    setSearchHeader(false);
  }

  async function getVideos() {
    //Get all videos data
    const querySnapshotVideos = await getDocs(collection(db, "Videos"));
    const videosArr = [];
    querySnapshotVideos.forEach((doc) => {
      videosArr.push(doc.data());
    });
    setVideos(videosArr);

    //Get all users data
    const querySnapshotUsers = await getDocs(collection(db, "Users"));
    const usersArr = [];
    querySnapshotUsers.forEach((doc) => {
      usersArr.push(doc.data());
    });
    setUsers(usersArr);
  }

  useEffect(async () => {
    await getVideos();
    //console.log("a");
  }, []);

  console.log(abc, "s");
  //console.log(autocompleteState, "auto complete state");

  return (
    <div {...autocomplete.getRootProps({})}>
      <input
        {...inputFocusProp}
        {...autocomplete.getInputProps({})}
        placeholder="Search..."


        // onChange={(e) => setSearchInput(e.target.value)}
        // value={searchInput}
      />

      <div
        className="hp-header-search-result"
        {...autocomplete.getPanelProps({})}
      >
        {autocompleteState.isOpen &&
          autocompleteState.collections.map((collection, index) => {
            const { source, items } = collection;

            return (
              items.length > 0 && (
                <ul key={index} {...autocomplete.getListProps()}>
                  {items.map((item, index) => (
                    // index < 4 &&
                    <li
                      key={index}
                      {...autocomplete.getItemProps({
                        item,
                        source,
                      })}
                      className="hp-font-weight-500"
                    >
                      <Link to={item.url} onClick={linkHandleClick}>
                        {item.VideoTitle || item.Username}
                      </Link>
                    </li>
                  ))}
                </ul>
              )
            );
          })}
      </div>
    </div>
  );
}
