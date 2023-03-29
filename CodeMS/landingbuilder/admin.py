from django.contrib import admin
from .models import page, page_version, Category, Id_Category, Identifier, Hit, Block, BlockCategories
from landing.models import CourseRequest
from front.models import Placeholder

admin.site.register(page)
admin.site.register(Placeholder)
admin.site.register(page_version)
admin.site.register(Category)
admin.site.register(Id_Category)
admin.site.register(Identifier)
admin.site.register(Hit)
admin.site.register(Block)
admin.site.register(BlockCategories)
    
