let db = {
    screams: [
        {
            userHandle: "user",
            body: "scream body",
            createdAt: "2020-04-20T00:20:11.059Z",
            likeCount: 5,
            commentCount: 2
        }
    ],
    notifications: [
        {
            recipient: "user",
            sender: "john",
            read: "true | false",
            screamId: "lsjdflaefioawne",
            type: "like | comment",
            createAt: "2020-07-03T10:00:00.000Z"
        }
    ]
};

const userDetail = {
    // Redux data
    credentials: {
        bio: "My bio",
        createdAt: "2020-04-25T18:49:14.122Z",
        email: "user123@email.com",
        handle: "user123",
        imageUrl: "https://firebasestorage.googleapis.com/v0/b/h2-app.appspot.com/o/2825020769.png?alt=media",
        location: "Seattle",
        userId: "i7LIJ57cz8hEPw9oeBBhpQYO0733",
        website: "http://user.com"
    },
    likes: [
        {userHandle: "user", screamId: 'rplKG4oQuNdRNhtLbJaB'},
        {userHandle: "user", screamId: 'pqsPu87FKn3acqFvRU2k'}
    ]
};
