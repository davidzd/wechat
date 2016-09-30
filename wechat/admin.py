#coding=utf-8

'''
Author: Da
Date: 03072016
'''

from django.contrib import admin
from models import Discount_Info, Visitor, Rate

def mark_item_off(modeladmin, request, queryset):
    queryset.update(status=0)


class MyModelAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        qs = super(MyModelAdmin, self).get_queryset(request)
        if request.user.is_superuser:
            return qs
        else:
            return qs.filter(author=request.user)

class DiscountAdmin(admin.ModelAdmin):
    list_display = ('dis_id','dis_title','date','status')
    search_fields = ('dis_title',)
    actions = [mark_item_off]
    def save_model(self, request, obj, form, change):
        if change:  # 更改的时候
            obj_original = self.model.objects.get(pk=obj.pk)
        else:  # 新增的时候
            obj_original = None

        obj.user = request.user
        obj.save()

class VisitorAdmin(admin.ModelAdmin):
    fields = ('image_tag', 'headimgurl','openid', 'province', 'city', 'country', 'sex', 'nickname', 'visit_time')
    readonly_fields = ('image_tag',)



admin.site.register(Discount_Info, DiscountAdmin)
admin.site.register(Visitor, VisitorAdmin)
admin.site.register(Rate)

# Register your models here.
