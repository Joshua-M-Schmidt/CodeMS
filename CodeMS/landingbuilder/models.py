from django.db import models
#from preferences.models import Preferences

# Create your models here.#

class Id_Category(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    color = models.CharField(max_length=255, default="grey")
    def __str__(self):
        return self.title

class Identifier(models.Model):
    identifier = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    id_cat = models.ForeignKey(Id_Category, on_delete=models.CASCADE)

class Category(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    color = models.CharField(max_length=255, default="grey")
    def __str__(self):
        return self.title

class page(models.Model):
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True,blank=True, null=True)
    revision = models.IntegerField(default=1)
    sub_revision = models.IntegerField(default=0)
    category = models.ForeignKey(Category, verbose_name="Category",on_delete=models.CASCADE, blank=True, null=True)

    json_content = models.TextField(blank=True)

    hits = models.IntegerField(default=0)
    offers = models.IntegerField(default=0)

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    admin = models.BooleanField(default=True)
    content = models.TextField(blank=True)
    
    def __str__(self):
        return self.name

class BlockCategories(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    color = models.CharField(max_length=255, default="grey")
    def __str__(self):
        return self.title
class Block(models.Model):
    identifier = models.CharField(unique=True, max_length=200)
    label = models.CharField(unique=True, max_length=200)
    category = models.ForeignKey(BlockCategories,on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    fa_icon = models.CharField(unique=True, max_length=200)

class Hit(models.Model):
    source_identifier = models.CharField(max_length=200, default='')
    page_hit = models.ForeignKey(page,on_delete=models.CASCADE)
    page_version = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)

    def __str__(self):
        return self.page_hit.name

class page_version(models.Model):
    page_link = models.ForeignKey(page, on_delete=models.CASCADE)
    revision = models.IntegerField()
    change_log = models.TextField(blank=True)
    content = models.TextField(blank=True)

    category = models.ForeignKey(Category, verbose_name="Category",on_delete=models.CASCADE, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.name

#class Optionen(Preferences):
#    request_email = models.EmailField()
#    request_email_secondary = models.EmailField(blank=True)