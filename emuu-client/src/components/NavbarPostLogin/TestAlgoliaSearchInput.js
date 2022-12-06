import React, { useState, useEffect, useRef } from "react";

import { createAutocomplete } from "@algolia/autocomplete-core";

import { db } from "../../Firebase.js";

import { collection, getDocs } from "firebase/firestore";

export default function HeaderSearch() {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const abc = videos.concat(users);

  const inputFocusRef = useRef(null);
  const inputFocusProp = {
    ref: inputFocusRef,
  };

  const autocomplete = createAutocomplete({
    onStateChange({ state }) {
      setAutocompleteState(state);

      setSearchInput(state.query);
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
            return {
              Usernames: abc.filter((item) =>
                item.Username?.toLowerCase().includes(query.toLocaleLowerCase())
              ),
              VideoTitles: abc.filter((item) =>
                item.Title?.toLowerCase().includes(query.toLowerCase())
              ),
            };
          },

          templates: {
            item({ item }) {
              return item.Title || item.Username;
            },
          },
        },
      ];
    },
  });

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

  useEffect(() => {
    (async () => {
      await getVideos();
    })();
  }, []);

  return (
    <>
      <div
        {...autocomplete.getRootProps({})}
        className="d-flex"
        style={{ position: "relative" }}
      >
        <input
          {...inputFocusProp}
          {...autocomplete.getInputProps({})}
          placeholder="Search..."
          value={searchInput}
          style={{
            borderRadius: "15px",
            paddingTop: "7px",
            paddingBottom: "7px",
            paddingLeft: "14px",
            paddingRight: "14px",
          }}
        />
        <div
          className="d-flex"
          style={{
            position: "absolute",
            zIndex: 1,
            backgroundColor: "#f9f9f9",
            top: "42px",
            left: "10px",
          }}
        >
          <div {...autocomplete.getPanelProps({})}>
            {autocompleteState.isOpen &&
              autocompleteState.collections.map((collection, index) => {
                const { source, items } = collection;

                return (
                  items.length > 0 &&
                  items[0]["Usernames"].length > 0 && (
                    <ul
                      key={index}
                      {...autocomplete.getListProps()}
                      style={{ listStyleType: "none" }}
                    >
                      {items[0]["Usernames"].map(
                        (item, index2) =>
                          item["DateJoined"] && (
                            <li
                              key={index2}
                              {...autocomplete.getItemProps({
                                item,
                                source,
                              })}
                              className="hp-font-weight-500"
                            >
                              {" Username:" + item.Username}
                            </li>
                          )
                      )}
                    </ul>
                  )
                );
              })}

            {autocompleteState.isOpen &&
              autocompleteState.collections.map((collection, index) => {
                const { source, items } = collection;
                return (
                  items.length > 0 &&
                  items[0]["VideoTitles"].length > 0 && (
                    <ul
                      key={index}
                      {...autocomplete.getListProps()}
                      style={{ listStyleType: "none" }}
                    >
                      {items[0]["VideoTitles"].map(
                        (item, index2) =>
                          // index < 4 &&
                          item["VideoTitle"] && (
                            <li
                              key={index2}
                              {...autocomplete.getItemProps({
                                item,
                                source,
                              })}
                              className="hp-font-weight-500"
                            >
                              {" VideoTitle:" + item.Title}
                            </li>
                          )
                      )}
                    </ul>
                  )
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
