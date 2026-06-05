# 修改日历节日显示的脚本
$filePath = "D:\Document\IDEProjects\Mood\entry\src\main\ets\pages\Index.ets"
$lines = Get-Content $filePath -Encoding UTF8

# 修改节日显示部分
$lines[1236] = '                        // 节日显示（带文字标识）'
$lines[1239] = '                            .fontSize(12)'
$lines[1243] = '                          Text(this.getHoliday(day)!.name)'
$lines[1244] = '                            .fontSize(9)'
$lines[1245] = '                            .fontColor(this.getHoliday(day)!.color)'
$lines[1246] = '                            .fontWeight(FontWeight.Medium)'
$lines[1247] = '                            .maxLines(1)'
$lines[1248] = '                            .textOverflow({ overflow: TextOverflow.Ellipsis })'
$lines[1249] = '                            .margin({ top: 1 })'

# 保存文件
$lines | Set-Content $filePath -Encoding UTF8
Write-Host "修改完成！"
