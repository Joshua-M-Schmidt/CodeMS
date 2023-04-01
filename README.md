# CodeMS

this is a lightweight django project especially suited for landing pages. It allows you to define endpoints in the backend and then edit the website in the frontend. Changes to text and images and even functionalities can be done without touching the backend and within minutes.

![](https://github.com/Joshua-M-Schmidt/CodeMS/blob/main/screenshots/pages.png?raw=true)


## Run this project

Set up the virtual environment

    python3 -m venv myvenv

On mac:
    
    source myvenv/bin/activate

On windows:
    
     myvenv\Scripts\activate

Install the requirements◊
    
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

in order to use the cms you need to define categories, blocks and pages. You can do this in the admin panel. The admin panel is located at `/admin/` and you can login with the superuser you created earlier.

all the configuration colors or icons are defined by MaterializeCSS, you can find the documentation here: https://materializecss.com/

### Blocks

these are elements that you can use again later when you are building your pages, these can be brand specific elements like a logo or a footer or they can be generic elements like a text block or a button. You can define the content of these blocks in the frontend.

#### Categories

first you need to add `BlockCategories`, go to `/admin/landingbuilder/blockcategory/add/` and add
for example:
| Field | Value |
| --- | --- | 
|**Title**| `navigation`|
|**Color** |`gray`|

these categories are later used in the drag and drop editor to group the blocks

#### Adding a blocks

then you can add `Blocks`, go to `/admin/landingbuilder/block/add/` and add the following:

| Field | Description | Value |
| --- | --- | --- |
|**Identifier**| *unique name for block without spaces*| `navbar_1` |
|**Label**| *name that is displayed to you*| `Navbar`|
|**Category**| *now select one of the above defined categories*| `navigation`|
|**Fa icon**| *font awesome icon to display in drag and drop editor*| `fa-solid fa-compass`|

now if you go to `/blocks` it should look like this:

![](https://github.com/Joshua-M-Schmidt/CodeMS/blob/main/screenshots/blocks.png?raw=true)

### Pages

To add a page you also need to add categories for the pages, go to `/admin/landingbuilder/pagecategory/add/` and add

| Field | Value |
| --- | --- | 
|**Title** | `Landing`| 
|**Color**| `green`|

now you can add pages, go to `/admin/landingbuilder/page/add/` and fill in the following:

| Field | Description | Value |
| --- | --- | --- |
|**Slug** |*used as address of the page*| `"landing"`|
|**Name** |*name displayed in the backend*| `"Landing page"`|
|**Description** |*description showen in the backend*| `"page for lead generation"`|
|**Admin** |*if true, only the admin can view the page, its advised to change later*| `True`|

now if you go to `/pages` it should look like this:

![](https://github.com/Joshua-M-Schmidt/CodeMS/blob/main/screenshots/pages.png?raw=true)

click on the page you just created and you should see an empty page, click on the wrench in the bottom right corner and you see the [GrapeJS editor (github)](https://github.com/GrapesJS/grapesjs), drag the starter template into the editor and you should see something like this:


![](https://github.com/Joshua-M-Schmidt/CodeMS/blob/main/screenshots/starter.png?raw=true)