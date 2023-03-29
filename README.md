# CodeMS

this is a lightweight django project especially suited for landing pages. It allows you to define endpoints in the backend and then edit the website in the frontend. Changes to text and images and even funktionalities can be done without touching the backend and within minutes.

## Run this project

Clone the repository

    git clone

Create an .env file in the root directory and add the following variables:

    SECRET_KEY=your_secret_key
    ALLOWED_HOSTS=

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

Create a superuser
    
        python manage.py createsuperuser

Run the server
        
        python manage.py runserver
        