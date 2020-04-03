let db = {
  users: [
    {
      email: "user@gmail.com",
      firstName: "Barbar",
      lastName: "Teef",
      profileImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/photospot-5f554.appspot.com/o/100274903.jpg?alt=media",
      photographer: true
    },

    {
      email: "user2@gmail.com",
      firstName: "Ahmed",
      lastName: "Feeder",
      profileImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/photospot-5f554.appspot.com/o/100274903.jpg?alt=media",
      photographer: false
    }
  ],

  photographer: [
    {
      email: "user@gmail.com",
      firstName: "Barbar",
      lastName: "Teef",
      profileImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/photospot-5f554.appspot.com/o/100274903.jpg?alt=media",
      photographer: true,
      photographyPictures: "",
      bio:
        "I am a fake photographer who thinks they are a photographer because I have an iPhone and want to photoshoot with hot girls",
      tags: "instagram, photoshoots, weddings",
      availability: "calender function",
      videography: "Yes/No",
      location: "Detroit, MI",
      company: "FekPhotography",
      website: "fekphotography.com",
      instagram: "feknews25",
      createdAt: "2020-03-21T20:15:39.344Z",
      ratePerHour: "$40",
      reviewCount: 5,
      rating: 4.3
    }
  ],

  reviewsTable: [
    {
      reviewer: "userid from users",
      reviewee: "userid from users",
      rating: 5,
      body: "Very clean teef cut"
    }
  ],

  ordersTable: [
    {
      photographer: "userid from users",
      consumer: "userid from users",
      location: "Detroit, MI",
      status: "pending/completed"
    }
  ]
};
