# Web Development Final Project - *Fourmulauto*

Submitted by: **Tien Nguyen**

This web app: **A modern car enthusiast forum where users can share posts about their vehicles, modifications, experiences, and automotive discussions. Built with React and Supabase, featuring image uploads, real-time comments, and an intuitive voting system styled with Nissan's signature red branding.**

Time spent: **X** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **Web app includes a create form that allows the user to create posts**
  - Form requires users to add a post title
  - Forms should have the *option* for users to add: 
    - additional textual content
    - an image added as an external image URL
- [x] **Web app includes a home feed displaying previously created posts**
  - Web app must include home feed displaying previously created posts
  - By default, each post on the posts feed should show only the post's:
    - creation time
    - title 
    - upvotes count
  - Clicking on a post should direct the user to a new page for the selected post
- [x] **Users can view posts in different ways**
  - Users can sort posts by either:
    -  creation time
    -  upvotes count
  - Users can search for posts by title
- [x] **Users can interact with each post in different ways**
  - The app includes a separate post page for each created post when clicked, where any additional information is shown, including:
    - content
    - image
    - comments
  - Users can leave comments underneath a post on the post page
  - Each post includes an upvote button on the post page. 
    - Each click increases the post's upvotes count by one
    - Users can upvote any post any number of times

- [x] **A post that a user previously created can be edited or deleted from its post pages**
  - After a user creates a new post, they can go back and edit the post
  - A previously created post can be deleted from its post page

The following **optional** features are implemented:


- [ ] Web app implements pseudo-authentication
  - Users can only edit and delete posts or delete comments by entering the secret key, which is set by the user during post creation
  - **or** upon launching the web app, the user is assigned a random user ID. It will be associated with all posts and comments that they make and displayed on them
  - For both options, only the original user author of a post can update or delete it
- [ ] Users can repost a previous post by referencing its post ID. On the post page of the new post
  - Users can repost a previous post by referencing its post ID
  - On the post page of the new post, the referenced post is displayed and linked, creating a thread
- [x] Users can customize the interface
  - e.g., selecting the color scheme or showing the content and image of each post on the home feed
- [x] Users can add more characterics to their posts
  - Users can share and view web videos
  - Users can set flags such as "Question" or "Opinion" while creating a post
  - Users can filter posts by flags on the home feed
  - Users can upload images directly from their local machine as an image file
- [ ] Web app displays a loading animation whenever data is being fetched

The following **additional** features are implemented:

* [x] **Image preview on home feed** - Posts with images show preview thumbnails on the main feed
* [x] **Content preview on home feed** - Posts with content show truncated preview text
* [x] **Nissan-inspired color scheme** - Custom red/white theme matching automotive branding
* [x] **Responsive design** - Mobile-friendly layout that works on all devices
* [x] **Real-time data** - Integrated with Supabase for live data updates
* [x] **File upload support** - Direct image uploads to Supabase storage

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

The main challenges encountered while building Fourmulauto included:

**Database Schema and RLS Policies:** Setting up Supabase Row Level Security (RLS) policies proved complex, especially for the storage bucket and comments table. Initial attempts resulted in "new row violates row-level security policy" errors, requiring multiple iterations to configure proper policies for public access while maintaining data integrity.

**Data Type Conflicts:** Encountered timestamp parsing errors where post IDs were being interpreted as timestamps in database queries. This required careful debugging of the comments fetching functionality and ensuring proper integer parsing of route parameters.

**Sorting Functionality:** The "Most Popular" sort feature initially didn't work due to array mutation issues. Fixed by creating proper array copies before sorting and handling null upvote values gracefully.

**File Upload Integration:** Implementing direct file uploads to Supabase storage required configuring both the storage bucket policies and the upload functionality in React. Initially faced CORS and authentication issues that were resolved by properly setting up public bucket access.

**State Management:** Managing the relationship between posts, comments, and real-time updates required careful consideration of when to fetch data and how to update the UI state efficiently without causing unnecessary re-renders.

**Responsive Design:** Ensuring the car forum looked professional across different screen sizes while maintaining the automotive theme required iterative CSS adjustments, particularly for the header navigation and post card layouts.

Despite these challenges, the final result is a fully functional car enthusiast forum with modern features like image uploads, real-time commenting, and an intuitive user interface styled with Nissan's brand colors.

## License

    Copyright [2025] [Tien Nguyen]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.