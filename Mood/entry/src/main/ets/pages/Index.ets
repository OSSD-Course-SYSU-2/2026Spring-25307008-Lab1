// 记录项类型定义
interface RecordItem {
  moodIndex: number;
  event: string;
  time: string;
  date: string; // 新增：完整日期
}

// 日期时间类型
interface DateTime {
  time: string;
  date: string;
}

// 今日统计类型
interface TodayStats {
  total: number;
  moodCounts: number[];
}

// 节日类型
interface Holiday {
  name: string;
  emoji: string;
  color: string;
}

// 使用AppStorage持久化记录数据
const STORAGE_KEY = 'mood_records';

@Entry
@Component
struct Index {
  // 当前选择的心情索引
  @State currentMoodIndex: number = 0;
  
  // 用户输入的事件记录
  @State eventText: string = '';
  
  // 保存的记录列表 - 从AppStorage初始化
  @State records: RecordItem[] = [];
  
  // 日历面板是否显示
  @State showCalendar: boolean = false;
  
  // 选中的日期
  @State selectedDate: string = '';
  
  // 日历面板偏移量
  @State calendarOffset: number = -300;
  
  // 当前显示的年月
  @State currentYear: number = 0;
  @State currentMonth: number = 0;

  // 心情表情数组
  private moodEmojis: string[] = ['😊', '😌', '😔', '😠', '😴'];
  
  // 心情名称数组
  private moodNames: string[] = ['开心', '平静', '难过', '生气', '疲惫'];
  
  // 心情描述数组
  private moodDescriptions: string[] = [
    '今天真是美好的一天！',
    '内心平静，一切安好',
    '心情有些低落...',
    '有点生气，需要冷静',
    '感觉有些疲惫，需要休息'
  ];
  
  // 鼓励文案数组
  private encouragementMessages: string[] = [
    '保持这份快乐，让美好延续下去！✨',
    '平静是最大的幸福，继续保持哦！🌸',
    '难过只是暂时的，明天会更好！💪',
    '深呼吸，让心情慢慢平复！🍃',
    '好好休息，给自己充充电！🔋'
  ];
  
  // 心情颜色数组
  private moodColors: string[] = ['#FFD700', '#5AC8FA', '#AF52DE', '#FF3B30', '#8E8E93'];

  // 组件加载时从AppStorage读取数据
  aboutToAppear(): void {
    this.loadRecordsFromStorage();
    // 初始化当前年月
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth() + 1;
  }

  // 从AppStorage加载记录
  private loadRecordsFromStorage(): void {
    try {
      const storedRecords = AppStorage.Get<RecordItem[]>(STORAGE_KEY);
      if (storedRecords && Array.isArray(storedRecords)) {
        this.records = storedRecords;
      }
    } catch (error) {
      console.error('从存储加载记录失败:', error);
      this.records = [];
    }
  }

  // 保存记录到AppStorage
  private saveRecordsToStorage(): void {
    try {
      AppStorage.SetOrCreate<RecordItem[]>(STORAGE_KEY, this.records);
    } catch (error) {
      console.error('保存记录到存储失败:', error);
    }
  }

  // 获取当前完整日期时间
  private getCurrentDateTime(): DateTime {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const result: DateTime = {
      time: `${hours}:${minutes}`,
      date: `${year}-${month}-${day}`
    };
    return result;
  }
  
  // 获取今日日期
  private getTodayDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // 获取今日统计
  private getTodayStats(): TodayStats {
    const today = this.getTodayDate();
    const todayRecords = this.records.filter((r: RecordItem) => r.date === today);
    const moodCounts: number[] = [0, 0, 0, 0, 0];
    todayRecords.forEach((r: RecordItem) => {
      moodCounts[r.moodIndex]++;
    });
    const result: TodayStats = { total: todayRecords.length, moodCounts };
    return result;
  }

  // 保存记录
  private saveRecord() {
    if (this.eventText.trim() === '') {
      return;
    }
    
    const dateTime = this.getCurrentDateTime();
    const newRecord: RecordItem = {
      moodIndex: this.currentMoodIndex,
      event: this.eventText.trim(),
      time: dateTime.time,
      date: dateTime.date
    };
    
    // 添加到记录列表开头
    this.records.unshift(newRecord);
    
    // 限制最多保存50条记录
    if (this.records.length > 50) {
      this.records = this.records.slice(0, 50);
    }
    
    // 保存到AppStorage
    this.saveRecordsToStorage();
    
    // 清空输入框
    this.eventText = '';
  }

  // 删除记录
  private deleteRecord(index: number) {
    this.records.splice(index, 1);
    this.records = [...this.records]; // 触发UI更新
    this.saveRecordsToStorage(); // 保存到AppStorage
  }

  // 清空所有记录
  private clearAllRecords() {
    this.records = [];
    this.saveRecordsToStorage(); // 保存到AppStorage
  }
  
  // 获取指定日期的记录
  private getRecordsByDate(date: string): RecordItem[] {
    return this.records.filter((r: RecordItem) => r.date === date);
  }
  
  // 获取当前显示的记录
  private getDisplayRecords(): RecordItem[] {
    if (this.selectedDate) {
      return this.getRecordsByDate(this.selectedDate);
    }
    return this.records;
  }
  
  // 获取指定日期的心情高频词（返回最常见的心情）
  private getTopMoodForDate(date: string): string {
    const dateRecords = this.getRecordsByDate(date);
    if (dateRecords.length === 0) {
      return '';
    }
    
    // 统计各心情出现次数
    const moodCounts: number[] = [0, 0, 0, 0, 0];
    dateRecords.forEach((r: RecordItem) => {
      moodCounts[r.moodIndex]++;
    });
    
    // 找出出现次数最多的心情
    let maxCount = 0;
    let topMoodIndex = 0;
    for (let i = 0; i < moodCounts.length; i++) {
      if (moodCounts[i] > maxCount) {
        maxCount = moodCounts[i];
        topMoodIndex = i;
      }
    }
    
    return this.moodEmojis[topMoodIndex];
  }
  
  // 获取指定日期的主要心情索引
  private getTopMoodIndexForDate(date: string): number {
    const dateRecords = this.getRecordsByDate(date);
    if (dateRecords.length === 0) {
      return -1;
    }
    
    // 统计各心情出现次数
    const moodCounts: number[] = [0, 0, 0, 0, 0];
    dateRecords.forEach((r: RecordItem) => {
      moodCounts[r.moodIndex]++;
    });
    
    // 找出出现次数最多的心情
    let maxCount = 0;
    let topMoodIndex = 0;
    for (let i = 0; i < moodCounts.length; i++) {
      if (moodCounts[i] > maxCount) {
        maxCount = moodCounts[i];
        topMoodIndex = i;
      }
    }
    
    return topMoodIndex;
  }
  
  // 获取日历数据（最近30天）
  private getCalendarDates(): string[] {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  }
  
  // 格式化日期显示
  private formatDateDisplay(dateStr: string): string {
    const parts = dateStr.split('-');
    const month = parts[1];
    const day = parts[2];
    return `${month}/${day}`;
  }
  
  // 判断日期是否有记录
  private hasRecordsOnDate(date: string): boolean {
    return this.records.some((r: RecordItem) => r.date === date);
  }
  
  // 切换日历面板
  private toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    if (this.showCalendar) {
      this.calendarOffset = 0;
    } else {
      this.calendarOffset = -300;
    }
  }
  
  // 选择日期并关闭日历
  private selectDate(date: string) {
    this.selectedDate = date;
    this.showCalendar = false;
    this.calendarOffset = -300;
  }
  
  // 获取某月的天数
  private getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }
  
  // 获取某月第一天是星期几（0-6，0表示周日）
  private getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month - 1, 1).getDay();
  }
  
  // 切换到上个月
  private prevMonth() {
    if (this.currentMonth === 1) {
      this.currentYear--;
      this.currentMonth = 12;
    } else {
      this.currentMonth--;
    }
  }
  
  // 切换到下个月
  private nextMonth() {
    if (this.currentMonth === 12) {
      this.currentYear++;
      this.currentMonth = 1;
    } else {
      this.currentMonth++;
    }
  }
  
  // 判断是否是今天
  private isToday(day: number): boolean {
    const today = new Date();
    return today.getFullYear() === this.currentYear &&
           today.getMonth() + 1 === this.currentMonth &&
           today.getDate() === day;
  }
  
  // 构造日期字符串
  private buildDateString(day: number): string {
    const monthStr = this.currentMonth.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${this.currentYear}-${monthStr}-${dayStr}`;
  }
  
  // 获取节日信息
  private getHoliday(day: number): Holiday | null {
    const monthStr = this.currentMonth.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const key = `${monthStr}-${dayStr}`;
    
    // 检查固定节日
    const fixedHoliday = this.getFixedHoliday(key);
    if (fixedHoliday) {
      return fixedHoliday;
    }
    
    // 检查特殊节日（母亲节、父亲节等）
    return this.getSpecialHoliday(day);
  }
  
  // 获取固定节日
  private getFixedHoliday(key: string): Holiday | null {
    const holiday: Holiday = { name: '', emoji: '', color: '' };
    
    // 一月
    if (key === '01-01') {
      holiday.name = '元旦';
      holiday.emoji = '🎊';
      holiday.color = '#FF6B6B';
      return holiday;
    }
    
    // 二月
    else if (key === '02-02') {
      holiday.name = '湿地日';
      holiday.emoji = '🌊';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '02-14') {
      holiday.name = '情人节';
      holiday.emoji = '💕';
      holiday.color = '#FF69B4';
      return holiday;
    }
    
    // 三月
    else if (key === '03-08') {
      holiday.name = '妇女节';
      holiday.emoji = '👩';
      holiday.color = '#FF69B4';
      return holiday;
    } else if (key === '03-12') {
      holiday.name = '植树节';
      holiday.emoji = '🌳';
      holiday.color = '#32CD32';
      return holiday;
    } else if (key === '03-14') {
      holiday.name = '白色情人节';
      holiday.emoji = '💝';
      holiday.color = '#FFB6C1';
      return holiday;
    } else if (key === '03-15') {
      holiday.name = '消费者权益日';
      holiday.emoji = '🛡️';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '03-21') {
      holiday.name = '睡眠日';
      holiday.emoji = '😴';
      holiday.color = '#9370DB';
      return holiday;
    } else if (key === '03-22') {
      holiday.name = '水日';
      holiday.emoji = '💧';
      holiday.color = '#4169E1';
      return holiday;
    }
    
    // 四月
    else if (key === '04-01') {
      holiday.name = '愚人节';
      holiday.emoji = '🤡';
      holiday.color = '#FFD700';
      return holiday;
    } else if (key === '04-07') {
      holiday.name = '健康日';
      holiday.emoji = '🏥';
      holiday.color = '#32CD32';
      return holiday;
    } else if (key === '04-22') {
      holiday.name = '地球日';
      holiday.emoji = '🌍';
      holiday.color = '#32CD32';
      return holiday;
    } else if (key === '04-23') {
      holiday.name = '读书日';
      holiday.emoji = '📖';
      holiday.color = '#D2691E'; // 亮棕色
      return holiday;
    }
    
    // 五月
    else if (key === '05-01') {
      holiday.name = '劳动节';
      holiday.emoji = '👷';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '05-04') {
      holiday.name = '青年节';
      holiday.emoji = '🎓';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '05-08') {
      holiday.name = '微笑日';
      holiday.emoji = '😊';
      holiday.color = '#FFD700';
      return holiday;
    } else if (key === '05-12') {
      holiday.name = '护士节';
      holiday.emoji = '💉';
      holiday.color = '#FF69B4';
      return holiday;
    } else if (key === '05-15') {
      holiday.name = '家庭日';
      holiday.emoji = '👨‍👩‍👧';
      holiday.color = '#FF69B4';
      return holiday;
    } else if (key === '05-31') {
      holiday.name = '无烟日';
      holiday.emoji = '🚭';
      holiday.color = '#32CD32';
      return holiday;
    }
    
    // 六月
    else if (key === '06-01') {
      holiday.name = '儿童节';
      holiday.emoji = '🎈';
      holiday.color = '#FFD700';
      return holiday;
    } else if (key === '06-05') {
      holiday.name = '环境日';
      holiday.emoji = '🌿';
      holiday.color = '#32CD32';
      return holiday;
    } else if (key === '06-06') {
      holiday.name = '爱眼日';
      holiday.emoji = '👁️';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '06-21') {
      holiday.name = '音乐日';
      holiday.emoji = '🎵';
      holiday.color = '#FF69B4';
      return holiday;
    } else if (key === '06-26') {
      holiday.name = '禁毒日';
      holiday.emoji = '🛡️';
      holiday.color = '#E74C3C'; // 亮红色
      return holiday;
    }
    
    // 七月
    else if (key === '07-01') {
      holiday.name = '建党节';
      holiday.emoji = '🚩';
      holiday.color = '#DC143C'; // 深红色
      return holiday;
    } else if (key === '07-11') {
      holiday.name = '航海日';
      holiday.emoji = '⛵';
      holiday.color = '#4169E1';
      return holiday;
    }
    
    // 八月
    else if (key === '08-01') {
      holiday.name = '建军节';
      holiday.emoji = '🎖️';
      holiday.color = '#FFD700';
      return holiday;
    } else if (key === '08-08') {
      holiday.name = '爸爸节';
      holiday.emoji = '👨';
      holiday.color = '#4169E1';
      return holiday;
    }
    
    // 九月
    else if (key === '09-10') {
      holiday.name = '教师节';
      holiday.emoji = '📚';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '09-16') {
      holiday.name = '臭氧层保护日';
      holiday.emoji = '🌍';
      holiday.color = '#32CD32';
      return holiday;
    } else if (key === '09-21') {
      holiday.name = '和平日';
      holiday.emoji = '☮️';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '09-27') {
      holiday.name = '旅游日';
      holiday.emoji = '✈️';
      holiday.color = '#5AC8FA';
      return holiday;
    }
    
    // 十月
    else if (key === '10-01') {
      holiday.name = '国庆节';
      holiday.emoji = '🇨🇳';
      holiday.color = '#DC143C'; // 深红色
      return holiday;
    } else if (key === '10-04') {
      holiday.name = '动物日';
      holiday.emoji = '🐾';
      holiday.color = '#D2691E'; // 亮棕色
      return holiday;
    } else if (key === '10-10') {
      holiday.name = '精神卫生日';
      holiday.emoji = '🧠';
      holiday.color = '#9370DB';
      return holiday;
    } else if (key === '10-31') {
      holiday.name = '万圣节';
      holiday.emoji = '🎃';
      holiday.color = '#FF8C00';
      return holiday;
    }
    
    // 十一月
    else if (key === '11-08') {
      holiday.name = '记者节';
      holiday.emoji = '📰';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '11-09') {
      holiday.name = '消防日';
      holiday.emoji = '🚒';
      holiday.color = '#FF6B6B'; // 浅红色
      return holiday;
    } else if (key === '11-11') {
      holiday.name = '光棍节';
      holiday.emoji = '🛒';
      holiday.color = '#FF6B6B';
      return holiday;
    } else if (key === '11-14') {
      holiday.name = '电影日';
      holiday.emoji = '🎬';
      holiday.color = '#FFD700';
      return holiday;
    } else if (key === '11-17') {
      holiday.name = '学生日';
      holiday.emoji = '🎓';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '11-20') {
      holiday.name = '儿童日';
      holiday.emoji = '👶';
      holiday.color = '#FFD700';
      return holiday;
    }
    
    // 十二月
    else if (key === '12-01') {
      holiday.name = '艾滋病日';
      holiday.emoji = '🎗️';
      holiday.color = '#E74C3C'; // 亮红色
      return holiday;
    } else if (key === '12-03') {
      holiday.name = '残疾人日';
      holiday.emoji = '♿';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '12-05') {
      holiday.name = '志愿者日';
      holiday.emoji = '🤝';
      holiday.color = '#32CD32';
      return holiday;
    } else if (key === '12-10') {
      holiday.name = '人权日';
      holiday.emoji = '⚖️';
      holiday.color = '#4169E1';
      return holiday;
    } else if (key === '12-25') {
      holiday.name = '圣诞节';
      holiday.emoji = '🎄';
      holiday.color = '#228B22';
      return holiday;
    } else if (key === '12-31') {
      holiday.name = '跨年夜';
      holiday.emoji = '🎆';
      holiday.color = '#FFD700';
      return holiday;
    }
    
    return null;
  }
  
  // 获取特殊节日（需要计算的节日）
  private getSpecialHoliday(day: number): Holiday | null {
    const date = new Date(this.currentYear, this.currentMonth - 1, day);
    const dayOfWeek = date.getDay(); // 0=周日
    
    // 母亲节：5月第二个星期日
    if (this.currentMonth === 5) {
      const firstDayOfMay = new Date(this.currentYear, 4, 1).getDay();
      const mothersDay = 8 + (7 - firstDayOfMay) % 7 + 7; // 第二个星期日
      if (day === mothersDay) {
        return { name: '母亲节', emoji: '👩‍👧', color: '#FF69B4' };
      }
    }
    
    // 父亲节：6月第三个星期日
    if (this.currentMonth === 6) {
      const firstDayOfJune = new Date(this.currentYear, 5, 1).getDay();
      const fathersDay = 8 + (7 - firstDayOfJune) % 7 + 14; // 第三个星期日
      if (day === fathersDay) {
        return { name: '父亲节', emoji: '👨‍👧', color: '#4169E1' };
      }
    }
    
    // 感恩节：11月第四个星期四
    if (this.currentMonth === 11) {
      const firstDayOfNov = new Date(this.currentYear, 10, 1).getDay();
      let thanksgiving = 1 + (4 - firstDayOfNov + 7) % 7; // 第一个星期四
      thanksgiving += 21; // 第四个星期四
      if (day === thanksgiving) {
        return { name: '感恩节', emoji: '🦃', color: '#FF8C00' };
      }
    }
    
    return null;
  }
  
  // 获取日历行数据
  private getCalendarRows(): number[][] {
    const rows: number[][] = [];
    const daysInMonth = this.getDaysInMonth(this.currentYear, this.currentMonth);
    const firstDay = this.getFirstDayOfMonth(this.currentYear, this.currentMonth);
    
    let currentRow: number[] = [];
    
    // 填充第一周的空白
    for (let i = 0; i < firstDay; i++) {
      currentRow.push(0);
    }
    
    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
      currentRow.push(day);
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
    
    // 填充最后一周的空白
    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push(0);
      }
      rows.push(currentRow);
    }
    
    return rows;
  }
  
  // 获取日期文本颜色
  private getDateTextColor(day: number): string {
    const dateStr = this.buildDateString(day);
    if (this.selectedDate === dateStr) {
      return '#FFFFFF';
    }
    if (this.isToday(day)) {
      return '#5AC8FA';
    }
    return '#333333';
  }
  
  // 获取日期背景颜色
  private getDateBackgroundColor(day: number): string {
    const dateStr = this.buildDateString(day);
    if (this.selectedDate === dateStr) {
      return '#5AC8FA';
    }
    
    // 节日特殊背景
    const holiday = this.getHoliday(day);
    if (holiday) {
      return holiday.color + '15'; // 节日颜色的淡色背景
    }
    
    if (this.isToday(day)) {
      return '#5AC8FA15';
    }
    return '#FFFFFF';
  }
  
  // 获取选中日期的节日信息
  private getSelectedDateHoliday(): Holiday | null {
    if (!this.selectedDate) {
      return null;
    }
    
    const parts = this.selectedDate.split('-');
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);
    
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const key = `${monthStr}-${dayStr}`;
    
    // 检查固定节日
    const fixedHoliday = this.getFixedHoliday(key);
    if (fixedHoliday) {
      return fixedHoliday;
    }
    
    // 检查特殊节日
    const year = parseInt(parts[0]);
    return this.getSpecialHolidayForDate(year, month, day);
  }
  
  // 获取特定日期的特殊节日
  private getSpecialHolidayForDate(year: number, month: number, day: number): Holiday | null {
    // 母亲节：5月第二个星期日
    if (month === 5) {
      const firstDayOfMay = new Date(year, 4, 1).getDay();
      const mothersDay = 8 + (7 - firstDayOfMay) % 7 + 7;
      if (day === mothersDay) {
        return { name: '母亲节', emoji: '👩‍👧', color: '#FF69B4' };
      }
    }
    
    // 父亲节：6月第三个星期日
    if (month === 6) {
      const firstDayOfJune = new Date(year, 5, 1).getDay();
      const fathersDay = 8 + (7 - firstDayOfJune) % 7 + 14;
      if (day === fathersDay) {
        return { name: '父亲节', emoji: '👨‍👧', color: '#4169E1' };
      }
    }
    
    // 感恩节：11月第四个星期四
    if (month === 11) {
      const firstDayOfNov = new Date(year, 10, 1).getDay();
      let thanksgiving = 1 + (4 - firstDayOfNov + 7) % 7;
      thanksgiving += 21;
      if (day === thanksgiving) {
        return { name: '感恩节', emoji: '🦃', color: '#FF8C00' };
      }
    }
    
    return null;
  }

  build() {
    Stack() {
      // 主页面内容
      Scroll() {
        Column() {
          // 顶部标题栏
          Row() {
            Text('今日心情打卡')
              .fontSize(28)
              .fontWeight(FontWeight.Bold)
              .fontColor('#000000')
              .layoutWeight(1)
            
            // 日历按钮
            Button() {
              Text('📅')
                .fontSize(24)
            }
            .width(44)
            .height(44)
            .backgroundColor('#FFFFFF')
            .borderRadius(22)
            .shadow({ radius: 8, color: '#00000015', offsetX: 0, offsetY: 2 })
            .onClick(() => {
              this.toggleCalendar();
            })
          }
          .width('90%')
          .margin({ top: 40, bottom: 20 })
          .justifyContent(FlexAlign.SpaceBetween)
          .alignItems(VerticalAlign.Center)

        // 今日统计卡片
        Column() {
          Row() {
            Text('今日统计')
              .fontSize(16)
              .fontWeight(FontWeight.Medium)
              .fontColor('#333333')
            
            Text(`已打卡 ${this.getTodayStats().total} 次`)
              .fontSize(14)
              .fontColor('#666666')
              .margin({ left: 'auto' })
          }
          .width('100%')
          .margin({ bottom: 12 })
          
          if (this.getTodayStats().total > 0) {
            // 显示今日主要心情
            Row() {
              Text('主要心情：')
                .fontSize(14)
                .fontColor('#666666')
              
              Row() {
                Text(this.moodEmojis[this.getTopMoodIndexForDate(this.getTodayDate())])
                  .fontSize(18)
                Text(this.moodNames[this.getTopMoodIndexForDate(this.getTodayDate())])
                  .fontSize(14)
                  .fontColor(this.moodColors[this.getTopMoodIndexForDate(this.getTodayDate())])
                  .fontWeight(FontWeight.Medium)
                  .margin({ left: 6 })
              }
              .padding({ left: 10, right: 10, top: 4, bottom: 4 })
              .backgroundColor(this.moodColors[this.getTopMoodIndexForDate(this.getTodayDate())] + '20')
              .borderRadius(12)
              .margin({ left: 8 })
            }
            .width('100%')
            .margin({ bottom: 12 })
            .justifyContent(FlexAlign.Start)
            
            // 显示各心情统计
            Row() {
              ForEach([0, 1, 2, 3, 4], (moodIndex: number) => {
                if (this.getTodayStats().moodCounts[moodIndex] > 0) {
                  Row() {
                    Text(this.moodEmojis[moodIndex])
                      .fontSize(16)
                    Text(`${this.getTodayStats().moodCounts[moodIndex]}`)
                      .fontSize(14)
                      .fontColor(this.moodColors[moodIndex])
                      .margin({ left: 4 })
                  }
                  .padding({ left: 8, right: 8, top: 4, bottom: 4 })
                  .backgroundColor(this.moodColors[moodIndex] + '15')
                  .borderRadius(12)
                  .margin({ right: 8 })
                }
              })
            }
            .width('100%')
            .justifyContent(FlexAlign.Start)
          } else {
            Text('今天还没有打卡记录哦~')
              .fontSize(14)
              .fontColor('#999999')
              .width('100%')
              .textAlign(TextAlign.Start)
          }
        }
        .width('90%')
        .padding(16)
        .backgroundColor('#FFFFFF')
        .borderRadius(16)
        .shadow({ radius: 8, color: '#00000008', offsetX: 0, offsetY: 2 })
        .margin({ bottom: 16 })

        // 心情显示卡片
        Column() {
          // 心情表情
          Text(this.moodEmojis[this.currentMoodIndex])
            .fontSize(80)
            .margin({ bottom: 16 })

          // 心情文字
          Text(this.moodNames[this.currentMoodIndex])
            .fontSize(24)
            .fontWeight(FontWeight.Medium)
            .fontColor(this.moodColors[this.currentMoodIndex])
            .margin({ bottom: 12 })

          // 心情描述
          Text(this.moodDescriptions[this.currentMoodIndex])
            .fontSize(16)
            .fontColor('#666666')
            .textAlign(TextAlign.Center)
            .padding({ left: 24, right: 24 })
            .maxLines(2)
            .margin({ bottom: 12 })
          
          // 鼓励文案
          Text(this.encouragementMessages[this.currentMoodIndex])
            .fontSize(14)
            .fontColor(this.moodColors[this.currentMoodIndex])
            .textAlign(TextAlign.Center)
            .padding({ left: 24, right: 24 })
            .maxLines(2)
            .lineHeight(20)
        }
        .width('90%')
        .padding(20)
        .backgroundColor('#FFFFFF')
        .borderRadius(20)
        .shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 })
        .margin({ bottom: 20 })

        // 心情选择按钮区域
        Column() {
          // 按钮区域标题
          Text('选择心情')
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#000000')
            .margin({ bottom: 16 })
            .width('100%')
            .textAlign(TextAlign.Start)

          // 第一行按钮：开心、平静、难过
          Row() {
            this.MoodButton(0)
            this.MoodButton(1)
            this.MoodButton(2)
          }
          .justifyContent(FlexAlign.SpaceBetween)
          .width('100%')
          .margin({ bottom: 12 })

          // 第二行按钮：生气、疲惫
          Row() {
            this.MoodButton(3)
            this.MoodButton(4)
          }
          .justifyContent(FlexAlign.SpaceBetween)
          .width('100%')
        }
        .width('90%')
        .padding({ top: 20, bottom: 20, left: 20, right: 20 })
        .backgroundColor('#FFFFFF')
        .borderRadius(20)
        .shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 })
        .margin({ bottom: 20 })

        // 事件记录区域
        Column() {
          // 记录标题
          Text('记录今天发生的事情')
            .fontSize(18)
            .fontWeight(FontWeight.Medium)
            .fontColor('#000000')
            .margin({ bottom: 12 })
            .width('100%')
            .textAlign(TextAlign.Start)

          // 文本输入框
          TextInput({ text: this.eventText, placeholder: '请写下你此刻的心情哦～' })
            .placeholderColor('#999999')
            .placeholderFont({ size: 16 })
            .fontSize(16)
            .fontColor('#333333')
            .height(100)
            .width('100%')
            .padding(12)
            .backgroundColor('#FFFFFF')
            .borderRadius(12)
            .border({ width: 1, color: '#E0E0E0' })
            .onChange((value: string) => {
              this.eventText = value;
            })

          // 保存按钮
          Button('保存记录')
            .fontSize(16)
            .fontWeight(FontWeight.Medium)
            .fontColor('#FFFFFF')
            .type(ButtonType.Capsule)
            .backgroundColor(this.moodColors[this.currentMoodIndex])
            .width('100%')
            .height(48)
            .margin({ top: 16 })
            .enabled(this.eventText.trim().length > 0)
            .onClick(() => {
              this.saveRecord();
            })
        }
        .width('90%')
        .padding(20)
        .backgroundColor('#FFFFFF')
        .borderRadius(20)
        .shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 })
        .margin({ bottom: 20 })

        // 记录列表区域
        Column() {
          // 记录列表标题和操作按钮
          Row() {
            Text(this.selectedDate ? `${this.selectedDate} 的记录` : '心情记录')
              .fontSize(18)
              .fontWeight(FontWeight.Medium)
              .fontColor('#000000')
            
            Text(`(${this.getDisplayRecords().length}条)`)
              .fontSize(14)
              .fontColor('#666666')
              .margin({ left: 8 })
            
            // 返回全部记录按钮（当选择了日期时显示）
            if (this.selectedDate) {
              Button('全部')
                .fontSize(12)
                .fontColor('#5AC8FA')
                .backgroundColor('#5AC8FA15')
                .borderRadius(12)
                .height(28)
                .margin({ left: 8 })
                .onClick(() => {
                  this.selectedDate = '';
                })
            }
              
            // 清空按钮（当有记录时显示）
            if (this.records.length > 0 && !this.selectedDate) {
              Button('清空')
                .fontSize(12)
                .fontColor('#FF3B30')
                .backgroundColor('#FF3B3010')
                .borderRadius(12)
                .height(28)
                .margin({ left: 'auto' })
                .onClick(() => {
                  this.clearAllRecords();
                })
            }
          }
          .width('100%')
          .justifyContent(FlexAlign.Start)
          .margin({ bottom: 12 })

          // 记录列表
          if (this.getDisplayRecords().length === 0) {
            // 无记录提示
            Column() {
              Text('📝')
                .fontSize(40)
                .margin({ bottom: 12 })
                .opacity(0.5)
              
              Text(this.selectedDate ? '当天没有记录' : '暂无记录，开始记录今天的心情吧！')
                .fontSize(16)
                .fontColor('#999999')
                .textAlign(TextAlign.Center)
            }
            .width('100%')
            .height(120)
            .justifyContent(FlexAlign.Center)
            .alignItems(HorizontalAlign.Center)
          } else {
            // 记录列表 - 使用固定高度确保滚动
            Scroll() {
              Column() {
                ForEach(this.getDisplayRecords(), (item: RecordItem, index: number) => {
                  this.RecordItem(item, index)
                })
              }
              .width('100%')
            }
            .width('100%')
            .height(200) // 固定高度，超出可滚动
            .scrollBar(BarState.Auto)
          }
        }
        .width('90%')
        .padding(20)
        .backgroundColor('#FFFFFF')
        .borderRadius(20)
        .shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 })
        .margin({ bottom: 40 })
      }
      .width('100%')
      .alignItems(HorizontalAlign.Center)
      .padding({ top: 20, bottom: 20 })
    }
    .width('100%')
    .height('100%')
    .scrollable(ScrollDirection.Vertical)
    .scrollBar(BarState.Auto)
    .linearGradient({
      angle: 135,
      colors: [['#E8F4FD', 0.0], ['#F5F0FF', 0.5], ['#FFF5F5', 1.0]]
    })
    
    // 日历面板
    if (this.showCalendar) {
      Column() {
        // 遮罩层
        Column()
          .width('100%')
          .height('100%')
          .backgroundColor('#00000030')
          .onClick(() => {
            this.toggleCalendar();
          })
      }
      .width('100%')
      .height('100%')
      .position({ x: 0, y: 0 })
      
      // 日历面板
      Column() {
        // 标题栏
        Row() {
          Button() {
            Text('‹')
              .fontSize(28)
              .fontColor('#5AC8FA')
          }
          .width(40)
          .height(40)
          .backgroundColor('#F5F5F7')
          .borderRadius(20)
          .onClick(() => {
            this.prevMonth();
          })
          
          Text(`${this.currentYear}年${this.currentMonth}月`)
            .fontSize(20)
            .fontWeight(FontWeight.Bold)
            .fontColor('#000000')
            .layoutWeight(1)
            .textAlign(TextAlign.Center)
          
          Button() {
            Text('›')
              .fontSize(28)
              .fontColor('#5AC8FA')
          }
          .width(40)
          .height(40)
          .backgroundColor('#F5F5F7')
          .borderRadius(20)
          .onClick(() => {
            this.nextMonth();
          })
          
          Button() {
            Text('×')
              .fontSize(24)
              .fontColor('#666666')
          }
          .width(36)
          .height(36)
          .backgroundColor('#F5F5F7')
          .borderRadius(18)
          .margin({ left: 8 })
          .onClick(() => {
            this.toggleCalendar();
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16, top: 20, bottom: 16 })
        
        // 星期标题
        Row() {
          ForEach(['日', '一', '二', '三', '四', '五', '六'], (day: string) => {
            Text(day)
              .fontSize(14)
              .fontColor('#999999')
              .fontWeight(FontWeight.Medium)
              .width('14.28%')
              .textAlign(TextAlign.Center)
          })
        }
        .width('100%')
        .padding({ left: 16, right: 16, bottom: 12 })
        
        // 日历网格
        Scroll() {
          Column() {
            // 计算日历行数
            ForEach(this.getCalendarRows(), (row: number[], rowIndex: number) => {
              Row() {
                ForEach(row, (day: number) => {
                  if (day === 0) {
                    // 空白格子
                    Column()
                      .width('14.28%')
                      .height(60)
                  } else {
                    // 日期格子
                    Column() {
                      // 获取节日信息
                      if (this.getHoliday(day)) {
                        // 节日显示（带文字标识）
                        Column() {
                          Text(day.toString())
                            .fontSize(12)
                            .fontColor(this.getDateTextColor(day))
                            .fontWeight(FontWeight.Bold)
                          
                          Text(this.getHoliday(day)!.name)
                            .fontSize(9)
                            .fontColor(this.getHoliday(day)!.color)
                            .fontWeight(FontWeight.Medium)
                            .maxLines(1)
                            .textOverflow({ overflow: TextOverflow.Ellipsis })
                            .margin({ top: 1 })
                        }
                        .width('100%')
                        .height('100%')
                        .justifyContent(FlexAlign.Center)
                        .alignItems(HorizontalAlign.Center)
                      } else {
                        // 普通日期显示
                        Text(day.toString())
                          .fontSize(16)
                          .fontColor(this.getDateTextColor(day))
                          .fontWeight(this.isToday(day) ? FontWeight.Bold : FontWeight.Medium)
                        
                        if (this.hasRecordsOnDate(this.buildDateString(day))) {
                          Text(this.getTopMoodForDate(this.buildDateString(day)))
                            .fontSize(16)
                            .margin({ top: 4 })
                        } else {
                          Column()
                            .width(4)
                            .height(4)
                            .borderRadius(2)
                            .backgroundColor('#E0E0E0')
                            .margin({ top: 8 })
                        }
                      }
                    }
                    .width('14.28%')
                    .height(60)
                    .justifyContent(FlexAlign.Center)
                    .alignItems(HorizontalAlign.Center)
                    .backgroundColor(this.getDateBackgroundColor(day))
                    .borderRadius(8)
                    .border(this.getHoliday(day) ? { width: 2, color: this.getHoliday(day)!.color + '40' } : { width: 0, color: '#FFFFFF' })
                    .onClick(() => {
                      this.selectDate(this.buildDateString(day));
                    })
                  }
                })
              }
              .width('100%')
              .justifyContent(FlexAlign.SpaceBetween)
              .margin({ bottom: 4 })
            })
          }
          .width('100%')
          .padding({ left: 16, right: 16 })
        }
        .width('100%')
        .layoutWeight(1)
        .scrollBar(BarState.Auto)
        
        // 已选日期提示
        if (this.selectedDate) {
          Column() {
            Row() {
              Text(`已选择: ${this.selectedDate}`)
                .fontSize(14)
                .fontColor('#666666')
              
              Button('查看记录')
                .fontSize(14)
                .fontColor('#5AC8FA')
                .backgroundColor('#5AC8FA15')
                .borderRadius(12)
                .height(32)
                .margin({ left: 'auto' })
                .onClick(() => {
                  this.toggleCalendar();
                })
            }
            .width('100%')
            
            // 显示节日信息
            if (this.getSelectedDateHoliday()) {
              Row() {
                Text(this.getSelectedDateHoliday()!.emoji)
                  .fontSize(20)
                  .margin({ right: 8 })
                
                Text(this.getSelectedDateHoliday()!.name)
                  .fontSize(16)
                  .fontColor(this.getSelectedDateHoliday()!.color)
                  .fontWeight(FontWeight.Medium)
              }
              .width('100%')
              .margin({ top: 8 })
              .justifyContent(FlexAlign.Center)
            }
          }
          .width('100%')
          .padding({ left: 16, right: 16, top: 12, bottom: 12 })
          .backgroundColor('#F5F5F7')
        }
      }
      .width('100%')
      .height('70%')
      .backgroundColor('#FFFFFF')
      .borderRadius({ topLeft: 24, topRight: 24 })
      .shadow({ radius: 20, color: '#00000020', offsetX: 0, offsetY: -4 })
      .position({ x: 0, y: '100%' })
      .translate({ y: '-100%' })
    }
  }
  }

  // 构建心情按钮组件
  @Builder
  MoodButton(index: number) {
    Button() {
      Column() {
        Text(this.moodEmojis[index])
          .fontSize(24)
          .margin({ bottom: 6 })
        
        Text(this.moodNames[index])
          .fontSize(12)
          .fontColor(this.currentMoodIndex === index ? '#FFFFFF' : this.moodColors[index])
      }
      .padding({ top: 12, bottom: 12 })
    }
    .type(ButtonType.Capsule)
    .backgroundColor(this.currentMoodIndex === index ? this.moodColors[index] : '#FFFFFF')
    .borderColor(this.moodColors[index])
    .borderWidth(this.currentMoodIndex === index ? 0 : 1)
    .stateEffect(true)
    .width('30%')
    .height(70)
    .onClick(() => {
      this.currentMoodIndex = index;
    })
  }

  // 构建记录项组件
  @Builder
  RecordItem(record: RecordItem, index: number) {
    Row() {
      // 心情图标
      Column() {
        Text(this.moodEmojis[record.moodIndex])
          .fontSize(28)
      }
      .width(48)
      .height(48)
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
      .backgroundColor(this.moodColors[record.moodIndex] + '20')
      .borderRadius(24)

      // 记录内容
      Column() {
        Text(record.event)
          .fontSize(16)
          .fontColor('#333333')
          .fontWeight(FontWeight.Medium)
          .textAlign(TextAlign.Start)
          .maxLines(2)
          .lineHeight(22)
        
        Row() {
          Text(this.moodNames[record.moodIndex])
            .fontSize(12)
            .fontColor('#FFFFFF')
            .fontWeight(FontWeight.Medium)
            .padding({ left: 8, right: 8, top: 3, bottom: 3 })
            .backgroundColor(this.moodColors[record.moodIndex])
            .borderRadius(8)
          
          Text(`${record.date} ${record.time}`)
            .fontSize(12)
            .fontColor('#999999')
            .margin({ left: 8 })
        }
        .margin({ top: 8 })
        .width('100%')
        .justifyContent(FlexAlign.Start)
        .alignItems(VerticalAlign.Center)
      }
      .margin({ left: 12 })
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)

      // 删除按钮
      Button() {
        Text('×')
          .fontSize(18)
          .fontColor('#FF3B30')
          .fontWeight(FontWeight.Bold)
      }
      .width(32)
      .height(32)
      .backgroundColor('#FF3B3015')
      .borderRadius(16)
      .onClick(() => {
        this.deleteRecord(index);
      })
    }
    .width('100%')
    .padding(14)
    .backgroundColor('#FFFFFF')
    .borderRadius(16)
    .shadow({ radius: 6, color: '#00000008', offsetX: 0, offsetY: 2 })
    .margin({ bottom: 10 })
  }
}