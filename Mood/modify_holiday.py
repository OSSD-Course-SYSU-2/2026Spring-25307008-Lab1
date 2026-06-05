#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os

file_path = r"D:\Document\IDEProjects\Mood\entry\src\main\ets\pages\Index.ets"

# 读取文件
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 修改特定行（行号从0开始，所以1236对应line[1235]）
lines[1236] = '                        // 节日显示（带文字标识）\n'
lines[1239] = '                            .fontSize(12)\n'
lines[1243] = '                          Text(this.getHoliday(day)!.name)\n'
lines[1244] = '                            .fontSize(9)\n'
lines[1245] = '                            .fontColor(this.getHoliday(day)!.color)\n'
lines[1246] = '                            .fontWeight(FontWeight.Medium)\n'
lines[1247] = '                            .maxLines(1)\n'
lines[1248] = '                            .textOverflow({ overflow: TextOverflow.Ellipsis })\n'
lines[1249] = '                            .margin({ top: 1 })\n'

# 写回文件
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("修改完成！")
