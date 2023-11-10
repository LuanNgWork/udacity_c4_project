# Serverless Wishlist app

To implement this project, you need to implement a simple Wishlist application using AWS Lambda and Serverless framework.

# Functionality of the application

This application will allow creating/removing/updating/fetching wishlist items. Each item can optionally have an attachment image. Each user only has access to wishlist items that he/she has created.

# Wishlist items

The application should store wishlist devices, and each item contains the following fields:

* `itemId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a device item (e.g. "a digital light bulb")
* `description` (string) - note of item description
* `price` (number) - price of the item
* `done` (boolean) - true if an item was got/ reward, false otherwise
* `imageUrl` (string) (optional) - a URL pointing to an image attached to an item

You might also store an id of a user who created a device item.

In the image folder is my test-run record images of the application
