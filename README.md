# SHROPSHIRE BOOKFEST WEB APPLICATION

#### Video Demo: https://www.youtube.com/watch?v=RfHwQmPyzGw

#### Description:

**About the Project**:
This is a web app which will hopefully soon be deployed for 'Shropshire Bookfest', a local charity which promotes children's literacy through fostering a love of reading. The app is designed for the children who take part in Bookfest projects, of which there are two and they happen on alternate years. The first project comprises the 'Big Book Award' and 'Picture Book Award'. For these projects children from Key Stage 2 (Big Book Award) and Key Stage 1 (Picture Book Award) vote on their favourite books and whittle a longlist down to a shortlist of 6. Then, there is an event held in a local theatre where the winner of the Big Book Award is announced, whilst Picture Book Award has a more low-key video presentation format.

The app is meant to complement these projects and not to take their place. For this reason, voting will still be done in person in the schools and the app is really designed to get the children excited to read the books. Because it aims to encourage reading, there will not be a smartphone application version of this web app, nor will the website be specifically designed for phone usage.

**Files**\
databases:\
**bookfest.db** - The schema of this database file is quite complex because it holds both information about users as well as much book metadata.

- The books table holds an id for each book, its title, author, publication year and recommended reading age. It also holds a text input for an associated cover image path as well as a column for a description and an about author column where can be stored information pertaining to the book.
- The book_award_years table has its id as a primary key and the year in which the book award took place. It is used to filter the book award entries into their various years. (NB, this feature is not yet implemented.)
- The book_award_entries table holds records of which books made it onto the shortlist and is associated with the book_award_years table so that it can itemise when a book was shortlisted.
- The users table holds the user's id as the primary key as well as their first name, last name, password hash, email and a boolean to determine whether they have admin permissions or not.
- The moods and genres tables hold the names of the mood and genre that can be associated with each book respectively. The mood table also associated an emoji with each mood for more visual interest.
- The book_moods and book_genres tables allow each book to be associated with one of the moods and genres listed in their respective tables.
- The user_books table links the user data to the book data and allows for users to mark a book as read/not read and also to post a review for a book which is displayed in the reviews section of the web application.

middleware:\
**auth.js** - This file contains javascript which checks whether a user is 1. authenticated and 2. an administrator. I learned about these things by querying Gemini, but I implemented them myself. It also contains the route for logging out (destroying the req.session and redirecting to the homepage of the web app). \
**csrf.js** - This is a relatively advanced security feature which Claude Code recommended as the app became larger and more ambitious. I allowed it to create the tokens here, and I hope to do more research into them in the near future. \
**multer.js** - This file contains the javascript implementation of an image multer. I spent quite a while researching this topic with a combination of Gemini and video tutorials. Later, Claude Code helped me by adding a fileFilter to prevent users from uploading non-image files. This security feature felt important even at this non-deployed stage, so I allowed it to implement the code for me.

routes:\
**books.js** - This is the longest file I have ever written (and partially co-written with Claude Code) at nearly 400 lines long. It contains the routes for many of the features of the books element of the website. These include, but are not limited to
- The general displaying of the book inventory upon visiting the /books route.
- The route for toggling between 'read' and 'not read' (I had this feature working, but it was buggy, so I asked Claude Code to re-implement it in a more satisfactory way)
- The book info page (I asked Claude to do this as I had done much of the heavy lifting of information retrieval and passing to the frontend)
- The pages for managing books, including the functionality to add new books and edit current ones. Gemini and Claude were useful here, especially in integrating the CsrfToken, but the bulk of the work was my own.

**login.js** - This was one of the first files that I wrote. It allowed me to learn about js Express backend where before (for 'Finance') I had been using python's Flask. The file takes a user's email and password and logs them in if they match the database's email and password hash. \
**profile.js** - This route came early and has remained fairly basic. It currently displays the user's first name, surname and email dynamically and a simple profile icon (which I created in Canva). I will soon implement the ability to choose between various different profile icons. It also displays the books they have either marked as 'read' or written a review for (plus a preview of the first bit of the review). The page will eventually have badges and other features, but again these are WIPs. \
**register.js** - This was another early route that I implemented. Rather like the registration route for 'Finance', it takes user input (in this instance first name, surname, email and password/password verification) and creates a new user. I still need to implement an email verification system, but that will come later. \
**reviews.js** - This file holds the backend for the reviews. It queries the database and displays all reviews in the '.get' route and the '.post' routes provide the framework for the creation and deletion of reviews. Some of this file was written with the help of GitHub Copilot.

static:\
**preview.js** - This file allows for the dynamic previewing of the book cover images that are in the process of being uploaded in the manage and edit sections of the book pages. It takes the file that is soon to be uploaded and previews it on the page. \
**search.js** - This is the file that I am proudest of. It sets up more of the backend for the search and filtering features. It also has a 'debounced' search bar, which is something I had not even heard of before starting the project, but now feel I understand well and could implement again if necessary. Once I had everything up and running, Claude Code came in and implemented a couple of bonus features, such as the navigation to book info pages on the newly-displayed results once a search query has been made. Claude's implementations are all attributed, as usual. \
**toggle.js** - The toggling between 'read' and 'not read' is one of the features that I had Claude Code help me to update and get functioning properly. I worked hard at getting the logic behind how I wanted the button to work, and eventually realised that this was something that I could explain to Claude and that its version would have fewer bugs. \
**styles.css** - This file contains much of the css implementation that is not native to Bootstrap. Much of the web app would appear entirely differently without the styling applied here. It contains styles for book display cards, hover and focus and active elements in the dropdowns and much more.

views:\
**books.ejs** - Contains the ejs elements for the book inventory page as well as its search feature. Also contains the display information for the 'add', 'read' and 'not read' button.\
**edit.ejs** - Contains the ejs elements for editing a book's data on the website (without the need to go straight to the database). Much of the ejs is necessarily similar to the manage page, so as to facilitate easy user interaction. Originally, I had used a Bootstrap Modal for this edit feature, but it was clunky and so I refactored it to be a page by itself.\
**index.ejs** - Contains the homepage. This was actually the last thing I implemented. I knew that I wanted AOS (Animate on Scroll) features, which the page contains, but I know also that I want to improve this page at a later date. As it is, it is functional and moderately engaging visually, so I am happy with it at this stage.\
**info.ejs** - A page of information about each book. As with many of the other views, this page uses data from the books database to display information on the books dynamically.\
**layout.ejs** - The layout view contains ejs for the top 10%(ish) of the website (i.e. the navbar). It uses Bootstrap for this purpose.\
**login.ejs** - This view contains the form necessary for logging in as an existing user. There is also some script data which checks if an error message has been received denoting a possible typo in the password (from the backend) and then runs an alert from the SweetAlert2 library.\
**manage.ejs** - This page contains the large form for the addition of new books as well as a table of currently accessible books. Although these have edit and delete functionality already, in the future, I will likely have to implement another search feature (with debounce) when the database becomes bigger and more unwieldy.\
**profile.ejs** - This view contains the ejs which retrieves the data from the users and user_books tables and displays it as a profile page.\
**register.ejs** - This view contains the ejs form for registering for a new account. The form links back to register.js, and the page also contains a few SweetAlert2 alerts for if the password is too short, if a user's email is already registered and so forth.
**reviews.ejs** - The reviews.ejs view was something I worked on in close collaboration with Claude Code. It took several implementations to get both the design and functionality right, and now that I have the skeleton of a reviews system, I feel confident that I will be able to improve on what I already have as the app goes forward.

**server.js** - This file contains the boilerplate code for the server to run correctly. It establishes the Crsf tokens, the middleware, the app itself, the routes and the database, amongst other things.


**More Design Choices**\
Along with those already discussed, there were many design choices which played a large role in how the project now appears and functions. For a start, the database was originally going to contain fewer tables, but as the ideas for the project kept expanding, I added things such as the user_books table to collect data on the user's interaction with the books. This allows the review system and 'mark as read' system to operate.

On the frontend, I ended up using mostly Bookfest's native colours (taken from the charity's logo) for the colour scheme of the website. However, the buttons' colours use Bootstrap's various options. I feel that this amount of blending looks as I wanted it to look and am happy with the result. The homepage is perhaps the element of the project that I am most keen to work on and improve. I have used royalty free images, but I would like to implement ones from the Bookfest archive as well as creating a more engaging page with more to see and click on. For now, however, I think the page is in good shape given what I need it to do.

The inclusion of emojis for the book moods was suggested specifically by Gemini and I am very happy with the emojis I chose and how they turned out. I also worked hard on the design of the add and edit book pages to make them intuitive but also maximally functional. I might make the reading age category into a drop down list in the future, but the design of these views as a whole is as I hoped it would be.

TODO -
I still have many things that I would like to implement before the web app goes live. Among these are the following:

- A quotes page which has a list of associated quotes from the books and which the children can 'heart'
- Implement Book Award Years and Entries tables in the database so that pages can be dynamically displayed of entered books and books per year
- A page with 'this year's shortlist'
- Book-O-Meter review sliders where kids can rate a book on various sliding scales (e.g. how fast did you read this? - Snail speed to rocket speed, how much did you laugh - no smiles - belly ache)
- 'Take me on an adventure' page which links to a random book that the user hasn't yet marked as read
- Badges for reading books, submitting reviews and so forth for the users. These will be able to be viewed on the user's profile page
- Incorporate many more books in the book database. Then, I will ensure that the page shows 30 books at a time (10 rows of 3 books per row)
- Pending status on reviews so that the admin can moderate the reviews before they are posted. Also, keyword filtering so that banned words are filtered out before they reach the server
- A dynamic toast when a user submits a review
- Email verification and general security tightening before deployment
- Of course, I also still need to work on the deployment of the web app
