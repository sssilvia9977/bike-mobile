import os
os.system('ionic build')
os.system('ionic cap copy')
os.system('ionic cap sync')
os.system('ionic cap open android')