if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    currentMoodIndex?: number;
    eventText?: string;
    records?: RecordItem[];
    showCalendar?: boolean;
    selectedDate?: string;
    calendarOffset?: number;
    currentYear?: number;
    currentMonth?: number;
    moodEmojis?: string[];
    moodNames?: string[];
    moodDescriptions?: string[];
    encouragementMessages?: string[];
    moodColors?: string[];
}
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
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentMoodIndex = new ObservedPropertySimplePU(0, this, "currentMoodIndex");
        this.__eventText = new ObservedPropertySimplePU('', this, "eventText");
        this.__records = new ObservedPropertyObjectPU([], this, "records");
        this.__showCalendar = new ObservedPropertySimplePU(false, this, "showCalendar");
        this.__selectedDate = new ObservedPropertySimplePU('', this, "selectedDate");
        this.__calendarOffset = new ObservedPropertySimplePU(-300, this, "calendarOffset");
        this.__currentYear = new ObservedPropertySimplePU(0, this, "currentYear");
        this.__currentMonth = new ObservedPropertySimplePU(0, this, "currentMonth");
        this.moodEmojis = ['😊', '😌', '😔', '😠', '😴'];
        this.moodNames = ['开心', '平静', '难过', '生气', '疲惫'];
        this.moodDescriptions = [
            '今天真是美好的一天！',
            '内心平静，一切安好',
            '心情有些低落...',
            '有点生气，需要冷静',
            '感觉有些疲惫，需要休息'
        ];
        this.encouragementMessages = [
            '保持这份快乐，让美好延续下去！✨',
            '平静是最大的幸福，继续保持哦！🌸',
            '难过只是暂时的，明天会更好！💪',
            '深呼吸，让心情慢慢平复！🍃',
            '好好休息，给自己充充电！🔋'
        ];
        this.moodColors = ['#FFD700', '#5AC8FA', '#AF52DE', '#FF3B30', '#8E8E93'];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.currentMoodIndex !== undefined) {
            this.currentMoodIndex = params.currentMoodIndex;
        }
        if (params.eventText !== undefined) {
            this.eventText = params.eventText;
        }
        if (params.records !== undefined) {
            this.records = params.records;
        }
        if (params.showCalendar !== undefined) {
            this.showCalendar = params.showCalendar;
        }
        if (params.selectedDate !== undefined) {
            this.selectedDate = params.selectedDate;
        }
        if (params.calendarOffset !== undefined) {
            this.calendarOffset = params.calendarOffset;
        }
        if (params.currentYear !== undefined) {
            this.currentYear = params.currentYear;
        }
        if (params.currentMonth !== undefined) {
            this.currentMonth = params.currentMonth;
        }
        if (params.moodEmojis !== undefined) {
            this.moodEmojis = params.moodEmojis;
        }
        if (params.moodNames !== undefined) {
            this.moodNames = params.moodNames;
        }
        if (params.moodDescriptions !== undefined) {
            this.moodDescriptions = params.moodDescriptions;
        }
        if (params.encouragementMessages !== undefined) {
            this.encouragementMessages = params.encouragementMessages;
        }
        if (params.moodColors !== undefined) {
            this.moodColors = params.moodColors;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentMoodIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__eventText.purgeDependencyOnElmtId(rmElmtId);
        this.__records.purgeDependencyOnElmtId(rmElmtId);
        this.__showCalendar.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDate.purgeDependencyOnElmtId(rmElmtId);
        this.__calendarOffset.purgeDependencyOnElmtId(rmElmtId);
        this.__currentYear.purgeDependencyOnElmtId(rmElmtId);
        this.__currentMonth.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentMoodIndex.aboutToBeDeleted();
        this.__eventText.aboutToBeDeleted();
        this.__records.aboutToBeDeleted();
        this.__showCalendar.aboutToBeDeleted();
        this.__selectedDate.aboutToBeDeleted();
        this.__calendarOffset.aboutToBeDeleted();
        this.__currentYear.aboutToBeDeleted();
        this.__currentMonth.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 当前选择的心情索引
    private __currentMoodIndex: ObservedPropertySimplePU<number>;
    get currentMoodIndex() {
        return this.__currentMoodIndex.get();
    }
    set currentMoodIndex(newValue: number) {
        this.__currentMoodIndex.set(newValue);
    }
    // 用户输入的事件记录
    private __eventText: ObservedPropertySimplePU<string>;
    get eventText() {
        return this.__eventText.get();
    }
    set eventText(newValue: string) {
        this.__eventText.set(newValue);
    }
    // 保存的记录列表 - 从AppStorage初始化
    private __records: ObservedPropertyObjectPU<RecordItem[]>;
    get records() {
        return this.__records.get();
    }
    set records(newValue: RecordItem[]) {
        this.__records.set(newValue);
    }
    // 日历面板是否显示
    private __showCalendar: ObservedPropertySimplePU<boolean>;
    get showCalendar() {
        return this.__showCalendar.get();
    }
    set showCalendar(newValue: boolean) {
        this.__showCalendar.set(newValue);
    }
    // 选中的日期
    private __selectedDate: ObservedPropertySimplePU<string>;
    get selectedDate() {
        return this.__selectedDate.get();
    }
    set selectedDate(newValue: string) {
        this.__selectedDate.set(newValue);
    }
    // 日历面板偏移量
    private __calendarOffset: ObservedPropertySimplePU<number>;
    get calendarOffset() {
        return this.__calendarOffset.get();
    }
    set calendarOffset(newValue: number) {
        this.__calendarOffset.set(newValue);
    }
    // 当前显示的年月
    private __currentYear: ObservedPropertySimplePU<number>;
    get currentYear() {
        return this.__currentYear.get();
    }
    set currentYear(newValue: number) {
        this.__currentYear.set(newValue);
    }
    private __currentMonth: ObservedPropertySimplePU<number>;
    get currentMonth() {
        return this.__currentMonth.get();
    }
    set currentMonth(newValue: number) {
        this.__currentMonth.set(newValue);
    }
    // 心情表情数组
    private moodEmojis: string[];
    // 心情名称数组
    private moodNames: string[];
    // 心情描述数组
    private moodDescriptions: string[];
    // 鼓励文案数组
    private encouragementMessages: string[];
    // 心情颜色数组
    private moodColors: string[];
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
        }
        catch (error) {
            console.error('从存储加载记录失败:', error);
            this.records = [];
        }
    }
    // 保存记录到AppStorage
    private saveRecordsToStorage(): void {
        try {
            AppStorage.SetOrCreate<RecordItem[]>(STORAGE_KEY, this.records);
        }
        catch (error) {
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
        }
        else {
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
        }
        else {
            this.currentMonth--;
        }
    }
    // 切换到下个月
    private nextMonth() {
        if (this.currentMonth === 12) {
            this.currentYear++;
            this.currentMonth = 1;
        }
        else {
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
        }
        else if (key === '02-14') {
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
        }
        else if (key === '03-12') {
            holiday.name = '植树节';
            holiday.emoji = '🌳';
            holiday.color = '#32CD32';
            return holiday;
        }
        else if (key === '03-14') {
            holiday.name = '白色情人节';
            holiday.emoji = '💝';
            holiday.color = '#FFB6C1';
            return holiday;
        }
        else if (key === '03-15') {
            holiday.name = '消费者权益日';
            holiday.emoji = '🛡️';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '03-21') {
            holiday.name = '睡眠日';
            holiday.emoji = '😴';
            holiday.color = '#9370DB';
            return holiday;
        }
        else if (key === '03-22') {
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
        }
        else if (key === '04-07') {
            holiday.name = '健康日';
            holiday.emoji = '🏥';
            holiday.color = '#32CD32';
            return holiday;
        }
        else if (key === '04-22') {
            holiday.name = '地球日';
            holiday.emoji = '🌍';
            holiday.color = '#32CD32';
            return holiday;
        }
        else if (key === '04-23') {
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
        }
        else if (key === '05-04') {
            holiday.name = '青年节';
            holiday.emoji = '🎓';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '05-08') {
            holiday.name = '微笑日';
            holiday.emoji = '😊';
            holiday.color = '#FFD700';
            return holiday;
        }
        else if (key === '05-12') {
            holiday.name = '护士节';
            holiday.emoji = '💉';
            holiday.color = '#FF69B4';
            return holiday;
        }
        else if (key === '05-15') {
            holiday.name = '家庭日';
            holiday.emoji = '👨‍👩‍👧';
            holiday.color = '#FF69B4';
            return holiday;
        }
        else if (key === '05-31') {
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
        }
        else if (key === '06-05') {
            holiday.name = '环境日';
            holiday.emoji = '🌿';
            holiday.color = '#32CD32';
            return holiday;
        }
        else if (key === '06-06') {
            holiday.name = '爱眼日';
            holiday.emoji = '👁️';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '06-21') {
            holiday.name = '音乐日';
            holiday.emoji = '🎵';
            holiday.color = '#FF69B4';
            return holiday;
        }
        else if (key === '06-26') {
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
        }
        else if (key === '07-11') {
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
        }
        else if (key === '08-08') {
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
        }
        else if (key === '09-16') {
            holiday.name = '臭氧层保护日';
            holiday.emoji = '🌍';
            holiday.color = '#32CD32';
            return holiday;
        }
        else if (key === '09-21') {
            holiday.name = '和平日';
            holiday.emoji = '☮️';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '09-27') {
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
        }
        else if (key === '10-04') {
            holiday.name = '动物日';
            holiday.emoji = '🐾';
            holiday.color = '#D2691E'; // 亮棕色
            return holiday;
        }
        else if (key === '10-10') {
            holiday.name = '精神卫生日';
            holiday.emoji = '🧠';
            holiday.color = '#9370DB';
            return holiday;
        }
        else if (key === '10-31') {
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
        }
        else if (key === '11-09') {
            holiday.name = '消防日';
            holiday.emoji = '🚒';
            holiday.color = '#FF6B6B'; // 浅红色
            return holiday;
        }
        else if (key === '11-11') {
            holiday.name = '光棍节';
            holiday.emoji = '🛒';
            holiday.color = '#FF6B6B';
            return holiday;
        }
        else if (key === '11-14') {
            holiday.name = '电影日';
            holiday.emoji = '🎬';
            holiday.color = '#FFD700';
            return holiday;
        }
        else if (key === '11-17') {
            holiday.name = '学生日';
            holiday.emoji = '🎓';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '11-20') {
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
        }
        else if (key === '12-03') {
            holiday.name = '残疾人日';
            holiday.emoji = '♿';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '12-05') {
            holiday.name = '志愿者日';
            holiday.emoji = '🤝';
            holiday.color = '#32CD32';
            return holiday;
        }
        else if (key === '12-10') {
            holiday.name = '人权日';
            holiday.emoji = '⚖️';
            holiday.color = '#4169E1';
            return holiday;
        }
        else if (key === '12-25') {
            holiday.name = '圣诞节';
            holiday.emoji = '🎄';
            holiday.color = '#228B22';
            return holiday;
        }
        else if (key === '12-31') {
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主页面内容
            Scroll.create();
            // 主页面内容
            Scroll.width('100%');
            // 主页面内容
            Scroll.height('100%');
            // 主页面内容
            Scroll.scrollable(ScrollDirection.Vertical);
            // 主页面内容
            Scroll.scrollBar(BarState.Auto);
            // 主页面内容
            Scroll.linearGradient({
                angle: 135,
                colors: [['#E8F4FD', 0.0], ['#F5F0FF', 0.5], ['#FFF5F5', 1.0]]
            });
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
            Column.padding({ top: 20, bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部标题栏
            Row.create();
            // 顶部标题栏
            Row.width('90%');
            // 顶部标题栏
            Row.margin({ top: 40, bottom: 20 });
            // 顶部标题栏
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 顶部标题栏
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日心情打卡');
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#000000');
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 日历按钮
            Button.createWithChild();
            // 日历按钮
            Button.width(44);
            // 日历按钮
            Button.height(44);
            // 日历按钮
            Button.backgroundColor('#FFFFFF');
            // 日历按钮
            Button.borderRadius(22);
            // 日历按钮
            Button.shadow({ radius: 8, color: '#00000015', offsetX: 0, offsetY: 2 });
            // 日历按钮
            Button.onClick(() => {
                this.toggleCalendar();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('📅');
            Text.fontSize(24);
        }, Text);
        Text.pop();
        // 日历按钮
        Button.pop();
        // 顶部标题栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 今日统计卡片
            Column.create();
            // 今日统计卡片
            Column.width('90%');
            // 今日统计卡片
            Column.padding(16);
            // 今日统计卡片
            Column.backgroundColor('#FFFFFF');
            // 今日统计卡片
            Column.borderRadius(16);
            // 今日统计卡片
            Column.shadow({ radius: 8, color: '#00000008', offsetX: 0, offsetY: 2 });
            // 今日统计卡片
            Column.margin({ bottom: 16 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('今日统计');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#333333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`已打卡 ${this.getTodayStats().total} 次`);
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ left: 'auto' });
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.getTodayStats().total > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 显示今日主要心情
                        Row.create();
                        // 显示今日主要心情
                        Row.width('100%');
                        // 显示今日主要心情
                        Row.margin({ bottom: 12 });
                        // 显示今日主要心情
                        Row.justifyContent(FlexAlign.Start);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('主要心情：');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.padding({ left: 10, right: 10, top: 4, bottom: 4 });
                        Row.backgroundColor(this.moodColors[this.getTopMoodIndexForDate(this.getTodayDate())] + '20');
                        Row.borderRadius(12);
                        Row.margin({ left: 8 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.moodEmojis[this.getTopMoodIndexForDate(this.getTodayDate())]);
                        Text.fontSize(18);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.moodNames[this.getTopMoodIndexForDate(this.getTodayDate())]);
                        Text.fontSize(14);
                        Text.fontColor(this.moodColors[this.getTopMoodIndexForDate(this.getTodayDate())]);
                        Text.fontWeight(FontWeight.Medium);
                        Text.margin({ left: 6 });
                    }, Text);
                    Text.pop();
                    Row.pop();
                    // 显示今日主要心情
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 显示各心情统计
                        Row.create();
                        // 显示各心情统计
                        Row.width('100%');
                        // 显示各心情统计
                        Row.justifyContent(FlexAlign.Start);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const moodIndex = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                If.create();
                                if (this.getTodayStats().moodCounts[moodIndex] > 0) {
                                    this.ifElseBranchUpdateFunction(0, () => {
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.padding({ left: 8, right: 8, top: 4, bottom: 4 });
                                            Row.backgroundColor(this.moodColors[moodIndex] + '15');
                                            Row.borderRadius(12);
                                            Row.margin({ right: 8 });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(this.moodEmojis[moodIndex]);
                                            Text.fontSize(16);
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(`${this.getTodayStats().moodCounts[moodIndex]}`);
                                            Text.fontSize(14);
                                            Text.fontColor(this.moodColors[moodIndex]);
                                            Text.margin({ left: 4 });
                                        }, Text);
                                        Text.pop();
                                        Row.pop();
                                    });
                                }
                                else {
                                    this.ifElseBranchUpdateFunction(1, () => {
                                    });
                                }
                            }, If);
                            If.pop();
                        };
                        this.forEachUpdateFunction(elmtId, [0, 1, 2, 3, 4], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 显示各心情统计
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('今天还没有打卡记录哦~');
                        Text.fontSize(14);
                        Text.fontColor('#999999');
                        Text.width('100%');
                        Text.textAlign(TextAlign.Start);
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        // 今日统计卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心情显示卡片
            Column.create();
            // 心情显示卡片
            Column.width('90%');
            // 心情显示卡片
            Column.padding(20);
            // 心情显示卡片
            Column.backgroundColor('#FFFFFF');
            // 心情显示卡片
            Column.borderRadius(20);
            // 心情显示卡片
            Column.shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 });
            // 心情显示卡片
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心情表情
            Text.create(this.moodEmojis[this.currentMoodIndex]);
            // 心情表情
            Text.fontSize(80);
            // 心情表情
            Text.margin({ bottom: 16 });
        }, Text);
        // 心情表情
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心情文字
            Text.create(this.moodNames[this.currentMoodIndex]);
            // 心情文字
            Text.fontSize(24);
            // 心情文字
            Text.fontWeight(FontWeight.Medium);
            // 心情文字
            Text.fontColor(this.moodColors[this.currentMoodIndex]);
            // 心情文字
            Text.margin({ bottom: 12 });
        }, Text);
        // 心情文字
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心情描述
            Text.create(this.moodDescriptions[this.currentMoodIndex]);
            // 心情描述
            Text.fontSize(16);
            // 心情描述
            Text.fontColor('#666666');
            // 心情描述
            Text.textAlign(TextAlign.Center);
            // 心情描述
            Text.padding({ left: 24, right: 24 });
            // 心情描述
            Text.maxLines(2);
            // 心情描述
            Text.margin({ bottom: 12 });
        }, Text);
        // 心情描述
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 鼓励文案
            Text.create(this.encouragementMessages[this.currentMoodIndex]);
            // 鼓励文案
            Text.fontSize(14);
            // 鼓励文案
            Text.fontColor(this.moodColors[this.currentMoodIndex]);
            // 鼓励文案
            Text.textAlign(TextAlign.Center);
            // 鼓励文案
            Text.padding({ left: 24, right: 24 });
            // 鼓励文案
            Text.maxLines(2);
            // 鼓励文案
            Text.lineHeight(20);
        }, Text);
        // 鼓励文案
        Text.pop();
        // 心情显示卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心情选择按钮区域
            Column.create();
            // 心情选择按钮区域
            Column.width('90%');
            // 心情选择按钮区域
            Column.padding({ top: 20, bottom: 20, left: 20, right: 20 });
            // 心情选择按钮区域
            Column.backgroundColor('#FFFFFF');
            // 心情选择按钮区域
            Column.borderRadius(20);
            // 心情选择按钮区域
            Column.shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 });
            // 心情选择按钮区域
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 按钮区域标题
            Text.create('选择心情');
            // 按钮区域标题
            Text.fontSize(18);
            // 按钮区域标题
            Text.fontWeight(FontWeight.Medium);
            // 按钮区域标题
            Text.fontColor('#000000');
            // 按钮区域标题
            Text.margin({ bottom: 16 });
            // 按钮区域标题
            Text.width('100%');
            // 按钮区域标题
            Text.textAlign(TextAlign.Start);
        }, Text);
        // 按钮区域标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 第一行按钮：开心、平静、难过
            Row.create();
            // 第一行按钮：开心、平静、难过
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 第一行按钮：开心、平静、难过
            Row.width('100%');
            // 第一行按钮：开心、平静、难过
            Row.margin({ bottom: 12 });
        }, Row);
        this.MoodButton.bind(this)(0);
        this.MoodButton.bind(this)(1);
        this.MoodButton.bind(this)(2);
        // 第一行按钮：开心、平静、难过
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 第二行按钮：生气、疲惫
            Row.create();
            // 第二行按钮：生气、疲惫
            Row.justifyContent(FlexAlign.SpaceBetween);
            // 第二行按钮：生气、疲惫
            Row.width('100%');
        }, Row);
        this.MoodButton.bind(this)(3);
        this.MoodButton.bind(this)(4);
        // 第二行按钮：生气、疲惫
        Row.pop();
        // 心情选择按钮区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 事件记录区域
            Column.create();
            // 事件记录区域
            Column.width('90%');
            // 事件记录区域
            Column.padding(20);
            // 事件记录区域
            Column.backgroundColor('#FFFFFF');
            // 事件记录区域
            Column.borderRadius(20);
            // 事件记录区域
            Column.shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 });
            // 事件记录区域
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 记录标题
            Text.create('记录今天发生的事情');
            // 记录标题
            Text.fontSize(18);
            // 记录标题
            Text.fontWeight(FontWeight.Medium);
            // 记录标题
            Text.fontColor('#000000');
            // 记录标题
            Text.margin({ bottom: 12 });
            // 记录标题
            Text.width('100%');
            // 记录标题
            Text.textAlign(TextAlign.Start);
        }, Text);
        // 记录标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 文本输入框
            TextInput.create({ text: this.eventText, placeholder: '请写下你此刻的心情哦～' });
            // 文本输入框
            TextInput.placeholderColor('#999999');
            // 文本输入框
            TextInput.placeholderFont({ size: 16 });
            // 文本输入框
            TextInput.fontSize(16);
            // 文本输入框
            TextInput.fontColor('#333333');
            // 文本输入框
            TextInput.height(100);
            // 文本输入框
            TextInput.width('100%');
            // 文本输入框
            TextInput.padding(12);
            // 文本输入框
            TextInput.backgroundColor('#FFFFFF');
            // 文本输入框
            TextInput.borderRadius(12);
            // 文本输入框
            TextInput.border({ width: 1, color: '#E0E0E0' });
            // 文本输入框
            TextInput.onChange((value: string) => {
                this.eventText = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 保存按钮
            Button.createWithLabel('保存记录');
            // 保存按钮
            Button.fontSize(16);
            // 保存按钮
            Button.fontWeight(FontWeight.Medium);
            // 保存按钮
            Button.fontColor('#FFFFFF');
            // 保存按钮
            Button.type(ButtonType.Capsule);
            // 保存按钮
            Button.backgroundColor(this.moodColors[this.currentMoodIndex]);
            // 保存按钮
            Button.width('100%');
            // 保存按钮
            Button.height(48);
            // 保存按钮
            Button.margin({ top: 16 });
            // 保存按钮
            Button.enabled(this.eventText.trim().length > 0);
            // 保存按钮
            Button.onClick(() => {
                this.saveRecord();
            });
        }, Button);
        // 保存按钮
        Button.pop();
        // 事件记录区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 记录列表区域
            Column.create();
            // 记录列表区域
            Column.width('90%');
            // 记录列表区域
            Column.padding(20);
            // 记录列表区域
            Column.backgroundColor('#FFFFFF');
            // 记录列表区域
            Column.borderRadius(20);
            // 记录列表区域
            Column.shadow({ radius: 12, color: '#00000010', offsetX: 0, offsetY: 3 });
            // 记录列表区域
            Column.margin({ bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 记录列表标题和操作按钮
            Row.create();
            // 记录列表标题和操作按钮
            Row.width('100%');
            // 记录列表标题和操作按钮
            Row.justifyContent(FlexAlign.Start);
            // 记录列表标题和操作按钮
            Row.margin({ bottom: 12 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.selectedDate ? `${this.selectedDate} 的记录` : '心情记录');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('#000000');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`(${this.getDisplayRecords().length}条)`);
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 返回全部记录按钮（当选择了日期时显示）
            if (this.selectedDate) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('全部');
                        Button.fontSize(12);
                        Button.fontColor('#5AC8FA');
                        Button.backgroundColor('#5AC8FA15');
                        Button.borderRadius(12);
                        Button.height(28);
                        Button.margin({ left: 8 });
                        Button.onClick(() => {
                            this.selectedDate = '';
                        });
                    }, Button);
                    Button.pop();
                });
            }
            // 清空按钮（当有记录时显示）
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 清空按钮（当有记录时显示）
            if (this.records.length > 0 && !this.selectedDate) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('清空');
                        Button.fontSize(12);
                        Button.fontColor('#FF3B30');
                        Button.backgroundColor('#FF3B3010');
                        Button.borderRadius(12);
                        Button.height(28);
                        Button.margin({ left: 'auto' });
                        Button.onClick(() => {
                            this.clearAllRecords();
                        });
                    }, Button);
                    Button.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 记录列表标题和操作按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 记录列表
            if (this.getDisplayRecords().length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 无记录提示
                        Column.create();
                        // 无记录提示
                        Column.width('100%');
                        // 无记录提示
                        Column.height(120);
                        // 无记录提示
                        Column.justifyContent(FlexAlign.Center);
                        // 无记录提示
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('📝');
                        Text.fontSize(40);
                        Text.margin({ bottom: 12 });
                        Text.opacity(0.5);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.selectedDate ? '当天没有记录' : '暂无记录，开始记录今天的心情吧！');
                        Text.fontSize(16);
                        Text.fontColor('#999999');
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    // 无记录提示
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 记录列表 - 使用固定高度确保滚动
                        Scroll.create();
                        // 记录列表 - 使用固定高度确保滚动
                        Scroll.width('100%');
                        // 记录列表 - 使用固定高度确保滚动
                        Scroll.height(200);
                        // 记录列表 - 使用固定高度确保滚动
                        Scroll.scrollBar(BarState.Auto);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = (_item, index: number) => {
                            const item = _item;
                            this.RecordItem.bind(this)(item, index);
                        };
                        this.forEachUpdateFunction(elmtId, this.getDisplayRecords(), forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    ForEach.pop();
                    Column.pop();
                    // 记录列表 - 使用固定高度确保滚动
                    Scroll.pop();
                });
            }
        }, If);
        If.pop();
        // 记录列表区域
        Column.pop();
        Column.pop();
        // 主页面内容
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 日历面板
            if (this.showCalendar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.position({ x: 0, y: 0 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 遮罩层
                        Column.create();
                        // 遮罩层
                        Column.width('100%');
                        // 遮罩层
                        Column.height('100%');
                        // 遮罩层
                        Column.backgroundColor('#00000030');
                        // 遮罩层
                        Column.onClick(() => {
                            this.toggleCalendar();
                        });
                    }, Column);
                    // 遮罩层
                    Column.pop();
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 日历面板
                        Column.create();
                        // 日历面板
                        Column.width('100%');
                        // 日历面板
                        Column.height('70%');
                        // 日历面板
                        Column.backgroundColor('#FFFFFF');
                        // 日历面板
                        Column.borderRadius({ topLeft: 24, topRight: 24 });
                        // 日历面板
                        Column.shadow({ radius: 20, color: '#00000020', offsetX: 0, offsetY: -4 });
                        // 日历面板
                        Column.position({ x: 0, y: '100%' });
                        // 日历面板
                        Column.translate({ y: '-100%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 标题栏
                        Row.create();
                        // 标题栏
                        Row.width('100%');
                        // 标题栏
                        Row.padding({ left: 16, right: 16, top: 20, bottom: 16 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(40);
                        Button.height(40);
                        Button.backgroundColor('#F5F5F7');
                        Button.borderRadius(20);
                        Button.onClick(() => {
                            this.prevMonth();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('‹');
                        Text.fontSize(28);
                        Text.fontColor('#5AC8FA');
                    }, Text);
                    Text.pop();
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`${this.currentYear}年${this.currentMonth}月`);
                        Text.fontSize(20);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor('#000000');
                        Text.layoutWeight(1);
                        Text.textAlign(TextAlign.Center);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(40);
                        Button.height(40);
                        Button.backgroundColor('#F5F5F7');
                        Button.borderRadius(20);
                        Button.onClick(() => {
                            this.nextMonth();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('›');
                        Text.fontSize(28);
                        Text.fontColor('#5AC8FA');
                    }, Text);
                    Text.pop();
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(36);
                        Button.height(36);
                        Button.backgroundColor('#F5F5F7');
                        Button.borderRadius(18);
                        Button.margin({ left: 8 });
                        Button.onClick(() => {
                            this.toggleCalendar();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('×');
                        Text.fontSize(24);
                        Text.fontColor('#666666');
                    }, Text);
                    Text.pop();
                    Button.pop();
                    // 标题栏
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 星期标题
                        Row.create();
                        // 星期标题
                        Row.width('100%');
                        // 星期标题
                        Row.padding({ left: 16, right: 16, bottom: 12 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const day = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Text.create(day);
                                Text.fontSize(14);
                                Text.fontColor('#999999');
                                Text.fontWeight(FontWeight.Medium);
                                Text.width('14.28%');
                                Text.textAlign(TextAlign.Center);
                            }, Text);
                            Text.pop();
                        };
                        this.forEachUpdateFunction(elmtId, ['日', '一', '二', '三', '四', '五', '六'], forEachItemGenFunction);
                    }, ForEach);
                    ForEach.pop();
                    // 星期标题
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 日历网格
                        Scroll.create();
                        // 日历网格
                        Scroll.width('100%');
                        // 日历网格
                        Scroll.layoutWeight(1);
                        // 日历网格
                        Scroll.scrollBar(BarState.Auto);
                    }, Scroll);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ left: 16, right: 16 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 计算日历行数
                        ForEach.create();
                        const forEachItemGenFunction = (_item, rowIndex: number) => {
                            const row = _item;
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                Row.create();
                                Row.width('100%');
                                Row.justifyContent(FlexAlign.SpaceBetween);
                                Row.margin({ bottom: 4 });
                            }, Row);
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                ForEach.create();
                                const forEachItemGenFunction = _item => {
                                    const day = _item;
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        If.create();
                                        if (day === 0) {
                                            this.ifElseBranchUpdateFunction(0, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    // 空白格子
                                                    Column.create();
                                                    // 空白格子
                                                    Column.width('14.28%');
                                                    // 空白格子
                                                    Column.height(60);
                                                }, Column);
                                                // 空白格子
                                                Column.pop();
                                            });
                                        }
                                        else {
                                            this.ifElseBranchUpdateFunction(1, () => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    // 日期格子
                                                    Column.create();
                                                    // 日期格子
                                                    Column.width('14.28%');
                                                    // 日期格子
                                                    Column.height(60);
                                                    // 日期格子
                                                    Column.justifyContent(FlexAlign.Center);
                                                    // 日期格子
                                                    Column.alignItems(HorizontalAlign.Center);
                                                    // 日期格子
                                                    Column.backgroundColor(this.getDateBackgroundColor(day));
                                                    // 日期格子
                                                    Column.borderRadius(8);
                                                    // 日期格子
                                                    Column.border(this.getHoliday(day) ? { width: 2, color: this.getHoliday(day)!.color + '40' } : { width: 0, color: '#FFFFFF' });
                                                    // 日期格子
                                                    Column.onClick(() => {
                                                        this.selectDate(this.buildDateString(day));
                                                    });
                                                }, Column);
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    If.create();
                                                    // 获取节日信息
                                                    if (this.getHoliday(day)) {
                                                        this.ifElseBranchUpdateFunction(0, () => {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                // 节日显示（带文字标识）
                                                                Column.create();
                                                                // 节日显示（带文字标识）
                                                                Column.width('100%');
                                                                // 节日显示（带文字标识）
                                                                Column.height('100%');
                                                                // 节日显示（带文字标识）
                                                                Column.justifyContent(FlexAlign.Center);
                                                                // 节日显示（带文字标识）
                                                                Column.alignItems(HorizontalAlign.Center);
                                                            }, Column);
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(day.toString());
                                                                Text.fontSize(12);
                                                                Text.fontColor(this.getDateTextColor(day));
                                                                Text.fontWeight(FontWeight.Bold);
                                                            }, Text);
                                                            Text.pop();
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                Text.create(this.getHoliday(day)!.name);
                                                                Text.fontSize(9);
                                                                Text.fontColor(this.getHoliday(day)!.color);
                                                                Text.fontWeight(FontWeight.Medium);
                                                                Text.maxLines(1);
                                                                Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                                                                Text.margin({ top: 1 });
                                                            }, Text);
                                                            Text.pop();
                                                            // 节日显示（带文字标识）
                                                            Column.pop();
                                                        });
                                                    }
                                                    else {
                                                        this.ifElseBranchUpdateFunction(1, () => {
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                // 普通日期显示
                                                                Text.create(day.toString());
                                                                // 普通日期显示
                                                                Text.fontSize(16);
                                                                // 普通日期显示
                                                                Text.fontColor(this.getDateTextColor(day));
                                                                // 普通日期显示
                                                                Text.fontWeight(this.isToday(day) ? FontWeight.Bold : FontWeight.Medium);
                                                            }, Text);
                                                            // 普通日期显示
                                                            Text.pop();
                                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                If.create();
                                                                if (this.hasRecordsOnDate(this.buildDateString(day))) {
                                                                    this.ifElseBranchUpdateFunction(0, () => {
                                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                            Text.create(this.getTopMoodForDate(this.buildDateString(day)));
                                                                            Text.fontSize(16);
                                                                            Text.margin({ top: 4 });
                                                                        }, Text);
                                                                        Text.pop();
                                                                    });
                                                                }
                                                                else {
                                                                    this.ifElseBranchUpdateFunction(1, () => {
                                                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                                            Column.create();
                                                                            Column.width(4);
                                                                            Column.height(4);
                                                                            Column.borderRadius(2);
                                                                            Column.backgroundColor('#E0E0E0');
                                                                            Column.margin({ top: 8 });
                                                                        }, Column);
                                                                        Column.pop();
                                                                    });
                                                                }
                                                            }, If);
                                                            If.pop();
                                                        });
                                                    }
                                                }, If);
                                                If.pop();
                                                // 日期格子
                                                Column.pop();
                                            });
                                        }
                                    }, If);
                                    If.pop();
                                };
                                this.forEachUpdateFunction(elmtId, row, forEachItemGenFunction);
                            }, ForEach);
                            ForEach.pop();
                            Row.pop();
                        };
                        this.forEachUpdateFunction(elmtId, this.getCalendarRows(), forEachItemGenFunction, undefined, true, false);
                    }, ForEach);
                    // 计算日历行数
                    ForEach.pop();
                    Column.pop();
                    // 日历网格
                    Scroll.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        // 已选日期提示
                        if (this.selectedDate) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.padding({ left: 16, right: 16, top: 12, bottom: 12 });
                                    Column.backgroundColor('#F5F5F7');
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create(`已选择: ${this.selectedDate}`);
                                    Text.fontSize(14);
                                    Text.fontColor('#666666');
                                }, Text);
                                Text.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Button.createWithLabel('查看记录');
                                    Button.fontSize(14);
                                    Button.fontColor('#5AC8FA');
                                    Button.backgroundColor('#5AC8FA15');
                                    Button.borderRadius(12);
                                    Button.height(32);
                                    Button.margin({ left: 'auto' });
                                    Button.onClick(() => {
                                        this.toggleCalendar();
                                    });
                                }, Button);
                                Button.pop();
                                Row.pop();
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    If.create();
                                    // 显示节日信息
                                    if (this.getSelectedDateHoliday()) {
                                        this.ifElseBranchUpdateFunction(0, () => {
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Row.create();
                                                Row.width('100%');
                                                Row.margin({ top: 8 });
                                                Row.justifyContent(FlexAlign.Center);
                                            }, Row);
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.getSelectedDateHoliday()!.emoji);
                                                Text.fontSize(20);
                                                Text.margin({ right: 8 });
                                            }, Text);
                                            Text.pop();
                                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                Text.create(this.getSelectedDateHoliday()!.name);
                                                Text.fontSize(16);
                                                Text.fontColor(this.getSelectedDateHoliday()!.color);
                                                Text.fontWeight(FontWeight.Medium);
                                            }, Text);
                                            Text.pop();
                                            Row.pop();
                                        });
                                    }
                                    else {
                                        this.ifElseBranchUpdateFunction(1, () => {
                                        });
                                    }
                                }, If);
                                If.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    // 日历面板
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    // 构建心情按钮组件
    MoodButton(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild();
            Button.type(ButtonType.Capsule);
            Button.backgroundColor(this.currentMoodIndex === index ? this.moodColors[index] : '#FFFFFF');
            Button.borderColor(this.moodColors[index]);
            Button.borderWidth(this.currentMoodIndex === index ? 0 : 1);
            Button.stateEffect(true);
            Button.width('30%');
            Button.height(70);
            Button.onClick(() => {
                this.currentMoodIndex = index;
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({ top: 12, bottom: 12 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.moodEmojis[index]);
            Text.fontSize(24);
            Text.margin({ bottom: 6 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.moodNames[index]);
            Text.fontSize(12);
            Text.fontColor(this.currentMoodIndex === index ? '#FFFFFF' : this.moodColors[index]);
        }, Text);
        Text.pop();
        Column.pop();
        Button.pop();
    }
    // 构建记录项组件
    RecordItem(record: RecordItem, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius(16);
            Row.shadow({ radius: 6, color: '#00000008', offsetX: 0, offsetY: 2 });
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 心情图标
            Column.create();
            // 心情图标
            Column.width(48);
            // 心情图标
            Column.height(48);
            // 心情图标
            Column.justifyContent(FlexAlign.Center);
            // 心情图标
            Column.alignItems(HorizontalAlign.Center);
            // 心情图标
            Column.backgroundColor(this.moodColors[record.moodIndex] + '20');
            // 心情图标
            Column.borderRadius(24);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.moodEmojis[record.moodIndex]);
            Text.fontSize(28);
        }, Text);
        Text.pop();
        // 心情图标
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 记录内容
            Column.create();
            // 记录内容
            Column.margin({ left: 12 });
            // 记录内容
            Column.layoutWeight(1);
            // 记录内容
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(record.event);
            Text.fontSize(16);
            Text.fontColor('#333333');
            Text.fontWeight(FontWeight.Medium);
            Text.textAlign(TextAlign.Start);
            Text.maxLines(2);
            Text.lineHeight(22);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 8 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.Start);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.moodNames[record.moodIndex]);
            Text.fontSize(12);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Medium);
            Text.padding({ left: 8, right: 8, top: 3, bottom: 3 });
            Text.backgroundColor(this.moodColors[record.moodIndex]);
            Text.borderRadius(8);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${record.date} ${record.time}`);
            Text.fontSize(12);
            Text.fontColor('#999999');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        // 记录内容
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除按钮
            Button.createWithChild();
            // 删除按钮
            Button.width(32);
            // 删除按钮
            Button.height(32);
            // 删除按钮
            Button.backgroundColor('#FF3B3015');
            // 删除按钮
            Button.borderRadius(16);
            // 删除按钮
            Button.onClick(() => {
                this.deleteRecord(index);
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('×');
            Text.fontSize(18);
            Text.fontColor('#FF3B30');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        // 删除按钮
        Button.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.mood", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
