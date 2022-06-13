<h1 align="center">Ticketing Backend</h1>

## Contents

- [Link](#link)

- [How It Works](#how-it-works)

- [What To Do](#what-to-do)

- [Remote Database](#remote-database)

- [Endpoint](#endpoint)

## Link

- Link Heroku : https://tiketjauhar.herokuapp.com
- Link Cloudinary : "https://res.cloudinary.com/fazztrack/image/upload/v1652736197/tiketjauhar"

## How It Works ?

1. Download Postman Collection [[here](https://drive.google.com/drive/folders/1Ex1g-jWWNKC9nYNotq598n5idfvjCkrH?usp=sharing)]
2. Open Your Postman App
3. Import Postman Collection
4. Create Environtments in Postman & Set :

```bash
VARIABLE : itjobs
INITIAL VALUE : https://tiketjauhar.herokuapp.com
CURRENT VALUE : https://tiketjauhar.herokuapp.com
```

5. Test Request

## What To Do ?

1. Register using your real information
2. Open your registered email address
3. Open email and follow the instruction to verify your FazzPay account
4. Login and use the API

### Module Auth

| No. | Method | Endpoint                  | Information                      |
| --- | ------ | ------------------------- | -------------------------------- |
| 1.  | POST   | /auth/user/register       | Used for register new user.      |
| 2.  |        | /auth/user/login          | Used for login into app.         |
| 3.  |        | /auth/user/forgotPassword | Used for forgot password.        |
| 4.  |        | /auth/logout              | Used for logout from system.     |
| 5.  | GET    | /auth/user/verify/:key    | Used for activating new account. |
| 6.  | PATCH  | /auth/user/resetPassword  | Used for reseting password.      |

### Module Movie

| No. | Method | Endpoint                                                   | Information                                                  |
| --- | ------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| 1.  | GET    | /movie?page=1&limit=8&searchRelease=12&searchName=&sort=   | Used for get all movie for showing in home page.             |
| 2.  |        | /movie/:movieId                                            | Used for get movie by id                                     |
| 3.  | PATCH  | /movie/:movieId                                            | Used to change movie by admin.                               |
| 4.  | CREATE | /movie                                                     | Used to add movie by admin.                                  |
| 5.  | DEL    | /movie/:movieId                                            | Used to delete movie by admin.                               |

### Module Schedule

| No. | Method | Endpoint                                                   | Information                                                  |
| --- | ------ | ---------------------------------------------------------- | ------------------------------------------------------------ |
| 1.  | GET    | /schedule?page=1&limit=3&searchMovieId=3&sort=movie.id     | Used for get schedule for showing in detail page.            |
| 2.  |        | /schedule/:schedulId                                       | Used for get schedule by id                                  |
| 3.  | PATCH  | /schedule/:scheduleId                                      | Used to change schedule by admin                             |
| 4.  | CREATE | /schedule                                                  | Used to add schedule by admin                                |
| 5.  | DEL    | /schedule/:scheduleId                                      | Used to delete schedule by admin                             |

### Module Booking

| No. | Method | Endpoint                                                   | Information                           |
| --- | ------ | ---------------------------------------------------------- | ------------------------------------- |
| 1.  | GET    | /booking/id/:bookingId                                     | Used for get Booking by id            |
| 2.  |        | /booking/user/:userId                                      | Used for get Booking by user id       |
| 3.  |        | /booking/seat?dateBooking=&timeBooking=&scheduleId=2       | Used for get Booking by filtering     |
| 4.  |        | /booking/dash?scheduleId=51                                | Used for get dashboard for admin      |
| 5.  | PATCH  | /booking/:bookingId                                        | Used to change status booking         |
| 6.  | CREATE | /booking                                                   | Used to booking ticket by user        |
| 7.  |        | /booking/midtrans-notification                             | Used to get notivication midtrans     |

### Module User

| No. | Method | Endpoint                   | Information                        |
| --- | ------ | ---------------------------| -----------------------------------|
| 1.  | GET    | /user/:userId              | Used for get user by id            |
| 2.  | PATCH  | /user/profile/:userId      | Used to change profile user        |
| 3.  |        | /user/password/:userId     | Used to change password user       |
| 4.  |        | /user/image/:userId        | Used to change image user          |
| 5.  | DEL    | /user/delimage/:userId     | Used to delete image user          |
### JSON Format

The JSON format of the status pages can be often preferable, for example when the tooling or integration to other systems is easier to achieve via a common data format.

The status values follow the same format as described above - OK, and ERROR Message.

The equivalent to the status key form the plain format is a status key in the root JSON object. Subsystems should use nested objects also having a mandatory status key. Here are some examples:

**succes result**

```
{
    "status": 200,
    "msg": "Success get data !",
    "data": [
        {
            "id": 2,
            "name": "umma",
            "category": "Horror",
            "releaseDate": "2022-03-17T17:00:00.000Z",
            "image": "tiketjauhar/movie/utg32zovu7w3gjogmjyi",
            "cast": "Sandra Oh, Odeya Rush, Dermot Mulroney, Fivel Stewart, Tom Yi, Danielle K. Golden, MeeWha Alana Lee, Hana Marie Kim, Mark Kirksey",
            "director": "Iris K. Shim",
            "duration": "83 minute",
            "synopsis": "A Korean immigrant, Amanda, and her daughter Chris live on a rural farm, raising bees and chickens, and living without modern technology. When Amanda receives the cremated ashes of her deceased estranged mother from her birth country, it unleashes a vicio",
            "createdAt": "2022-03-24T05:45:11.000Z",
            "updateAt": "2022-03-24T06:44:54.000Z",
            "movieId": 1,
            "premiere": "Ebu.Id",
            "price": 50000,
            "location": "Tangerang",
            "dateStart": "2021-12-31T17:00:00.000Z",
            "dateEnd": "2022-01-31T17:00:00.000Z",
            "time": "19:00,13:00"
        }
    ]
}

```

**data null result**

```

{
    "status": 200,
    "msg": "User id 2accbfb4 is missing or never booking",
    "data": null
}

```

**error request result**

```
{
    "status": 404,
    "msg": "Data by id 65 not found",
    "data": null
}
```
