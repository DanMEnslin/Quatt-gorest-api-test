# Quatt application - gorest API tests

## This README.md details the testing of the gorest api's

## Installation & running of test suite

- Clone the repo using `git clone https://github.com/DanMEnslin/Quatt-gorest-api-test.git`
- open the cloned folder
- run `npm install` to install dependencies
- set your environmental variables by renaming the `.env.example` file to `.env` and filling in the base url and your own bearer token
- run `npx test` to run the tests
- run `allure serve allure-results` to generate the report, which will start an http server and open the report in a browser

Alternatively, you can see a report generated via CI at https://danmenslin.github.io/Quatt-gorest-api-test

### Firstly, some notes & clarifications:

- Given I did not have database access and knowing that the created data would be cleared out at a set interval, I chose to generate data on the fly using FakerJS and DTO's. This had the upside of allowing me to rapidly iterate on my tests, but does have one downside; seeding and deleting of data in the before/after hooks is considered a best practice, but is unnecessary in this case (and indeed, pretty hard to accomplish when you don't know what your data contains until it is generated)
- If I had to do this again (and preferably if I had access to the database) I would seed data in the before hooks and remove it in the after hooks, which would tidy up my test cases a lot
- This leads into another comment; I do a lot of Arrange-Assert-Act-Assert, mainly due to creating data in the test case and needing to be sure the request has been processed correctly; ideally I'd just follow the Arrange-Act-Assert convention
- There is reporting in the form of Allure, which I like as it allows for reporting history pretty easily (when the github actions works the way it says it will) and looks pretty good compared to most report generators
- I've added both the base_url and bearer token as env variables, with a util to simplify imports; not just because it means I don't have to duplicate code, but also as I can then reuse this functionality in CI with the github action
- I have added some negative paths to indicate that I have considered them. In reality if I had more time I would add quite a few more, but for me the happy paths are the most important and where you start in any automated test suite, and there are quite a number here. Please assume that I would have for example added tests to check for invalid tokens for all request types
- I would rather have written the tests in javascript as that is what I had used previously (and then only as a PoC to replace some bad Postman test suites) so there was an additional level of discomfort here, but since the job spec mentions typescript I did my best, there is probably quite a bit I could improve on.

### Development process

1. I initially created most requests in Postman to confirm request structure and body format required
2. I then configured a folder with Jest, Supertest, supporting @types, dotenv, eslint and prettier, as well as adding the environmental variables to ProcessEnv
3. I wrote my first test using hardcoded urls and request body's till I had a working test
4. I then added FakerJS, created the DTO's for all the data objects I would need in my requests and refactored my single test to used the relevant DTO
5. From here I expanded my test cases, creating 4 different spec files in a rough grouping of user list queries, creating of users, creating of user posts and associated comments, and creating User todo's. User creation is already at the point where I would split it into 2 files, one for happy paths and one for failures/edge cases. Any longer and you run into run out issues
6. I ran into an issue here; the todo get request returns a json timestamp that I was unable to convert and match to my locally generated Date type. I eventually gave up and removed this from the expect
7. Once I had a working set of test cases I added reporting in the form of Allure
8. I then configured CI to run on demand, with reports generated in Allure and with history going back 20 runs. At this point I hit an issue; the documented github action steps did not create the required folder structure and so delivered an empty report page. After much trawling of google I found someone who had the missing step block and I got it working, but I wasted hours on this part
9. I then cleaned up some naming and finalised documentation

## Project structure

Once cloned, dependencies installed, tests run and reports generated, your folder structure should looks like this:

```
├── .github
│   ├── workflows
│       └──quatt-api-test.yml
├── allure-reports
├── data
│   ├── createUserDto.ts
│   ├── createUserPostCommentsDto.ts
│   ├── createUserPostDto.ts
│   └── createUserTodoDto.ts
├── node_modules
├── tests
│   ├── createUser.test.ts
│   ├── createUserPosts.test.ts
│   ├── createUserTodos.test.ts
│   └── queryUsers.test.ts
├── utils
│   └── env.ts
├── .env
├── .gitignore
├── env.d.ts
├── eslint.config.mjs
├── jest.config.ts
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

I think the structure is pretty self-explanatory, with tests in their own tests folder, DTO's stored in a data folder, and various config files in the root folder. The allure-results folder contains the report data that is used to generate the final report

### Bugs & issues

- The create user POST occasionally fails with a 422 for some unknown reason; the data is fine
- User post POSTs do not seem to be idempotent; you can post the same post multiple times. The same is true of user comments and user todo's
- The most problematic issue I ran into was the todo get request returns a json object containing a json timestamp with a local timezone (I am guessing set to "Asia/Kolkata"). Converting and matching to a locally generated Date object is extremely difficult, as a local Date object will always be created in the local timezone, and is not easy to convert. I tried third party modules like Luxon, but this didn't help, and held me up for quite a while before I gave up
- There is no way to amend Todo's; at least I don't see an api call for this action, so I don't know how you'd update todo's from `pending` to `completed`
- Minor one, `content-type` header is returned in lower case, but if you try the request in Postman it's capitalised; this affected my expects initially till I logged the response body
- The `POST /public/v2/posts/6942470/comments` documentation implies you create a post with the `user_id`, but its actually the `post_id`, this got me for a while but I eventually figured it out
- The gorest site is not stable; on one day alone it was down for almost 3 hours

## Further improvements

I would add the following with more time:

- Switch to seeded data rather than FakerJS, and thus better follow best practices like before/after hooks
- Add a request factory to separate test structure from functionality and make tests more maintainable
- Create a util to provide url's for ease of maintenance
- Negative paths for all known response codes
- Invalid auth test cases for all requests
- Tests for idempotency for all posts
- More user search/update options, for example email & gender

Edit: I added a simple beforeEach to some spec files as I was bored
