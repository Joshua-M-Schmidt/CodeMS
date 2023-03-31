# CodeMS

this is a lightweight django project especially suited for landing pages. It allows you to define endpoints in the backend and then edit the website in the frontend. Changes to text and images and even functionalities can be done without touching the backend and within minutes.

## Run this project

Set up the virtual environment

    python3 -m venv myvenv

On mac:
    
    source myvenv/bin/activate

On windows:
    
     myvenv\Scripts\activate

Install the requirements
    
    pip install -r requirements.txt

Make the migrations
    
    python manage.py makemigrations
    python manage.py migrate

if there is an error try again with

    python manage.py migrate --run-syncdb

Create a superuser
    
    python manage.py createsuperuser

Create an .env file in the root directory and add the following variables:

    SECRET_KEY=your_secret_key
    ALLOWED_HOSTS=

Run the server
        
    python manage.py runserver
        
## Configuration

in order to use the cms you need to define categories, blocks and pages. You can do this in the admin panel. The admin panel is located at `http://localhost:8000/admin/` and you can login with the superuser you created earlier.

all the configuration colors or icons are defined by MaterializeCSS, you can find the documentation here: https://materializecss.com/

### Blocks

these are elements that you can use again later when you are building your pages, these can be brand specific elements like a logo or a footer or they can be generic elements like a text block or a button. You can define the content of these blocks in the frontend.

#### Categories

first you need to add `BlockCategories`, go to `http://localhost:8000/admin/landingbuilder/blockcategory/add/` and add
for example:
**Title:** `navigation`, **Color:** `gray`
**Title:** `section`, **Color:** `red`

these categories are later used in the drag and drop editor to group the blocks

#### Adding a block

then you can add `Blocks`, go to `http://localhost:8000/admin/landingbuilder/block/add/` and add the following:

**Identifier** *unique name for block without spaces*: `navbar_1`
**Label** *name that is displayed to you*: `Navbar`
**Category** *now select one of the above defined categories*: `navigation`
**Content** *html, css and javascript you can leave blanc for now*: ``
**Fa icon** *font awesome icon to display in drag and drop editor*: `fa-solid fa-compass`

