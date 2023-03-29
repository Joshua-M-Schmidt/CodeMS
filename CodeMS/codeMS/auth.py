

def  is_loggedin(user):
    if user.is_authenticated:
        return True
    else:
        return False

def is_superuser(user):
    if user.is_authenticated:
        if user.is_superuser:
            return True
        else:
            return False
    else:
        return False