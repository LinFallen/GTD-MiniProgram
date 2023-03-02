// pages/todos/todos.js
Page({
  data: {
    input: '', // 输入框的值
    todos: [], // 待办事项数组
    leftCount: 0, // 未完成的待办事项数量
    allCompleted: false, // 是否全部完成
    logs:[], // 操作日志
    toastHidden: true, // 是否隐藏操作结果提示框
  },

  // 页面显示时设置导航栏标题
  onShow: function(){
    wx.setNavigationBarTitle({
      title: '待办事项'
    })
  },

  save: function() { // 保存数据
    wx.setStorageSync('todo_list', this.data.todos); // 存储待办事项数组
    wx.setStorageSync('todo_logs', this.data.logs); // 存储操作日志数组
  },

  load: function() { // 读取数据
    var todos = wx.getStorageSync('todo_list');
    if (todos) {
      var leftCount = todos.filter(function (item) { // 计算未完成的待办事项数量
        return !item.completed;
      }).length;
      this.setData({ todos: todos, leftCount: leftCount });
    }
    var logs = wx.getStorageSync('todo_logs');
    if (logs) {
      this.setData({ logs: logs });
    }
  },

  // 页面加载时读取数据
  onLoad: function () {
    this.load();
  },

  // 输入框内容改变时更新页面数据
  inputChangeHandle: function (e) {
    this.setData({ input: e.detail.value });
  },

  // 添加待办事项
  addTodoHandle: function (e) {
    if(!this.data.input || !this.data.input.trim()) return; // 空值不添加 || 去除前后空格
    var todos = this.data.todos;
    todos.push({ name: this.data.input, completed: false });
    var logs = this.data.logs;
    logs.push({ timestamp: new Date(), action:'Add', name: this.data.input });
    this.setData({ input: '', todos: todos, leftCount: this.data.leftCount + 1, logs: logs });
    this.save()
  },  

  // 切换待办事项的完成状态
  toggleTodoHandle: function (e) {
    var index = e.currentTarget.dataset.index;
    var todos = this.data.todos;
    todos[index].completed = !todos[index].completed;
    var logs = this.data.logs;
    logs.push({
      timestamp: new Date(),
      action: todos[index].completed ? 'Finish' : 'Restart',
      name: todos[index].name
    })
    this.setData({
      todos: todos,
      leftCount: this.data.leftCount + (todos[index].completed ? -1 : 1),
      logs: logs
    });
    this.save()
  },  

  // 删除待办事项
  removeTodoHandle: function (e) {
    // 获取待删除的 todo 在数组中的索引
    var index = e.currentTarget.dataset.index;
    // 获取当前的 todos 数组
    var todos = this.data.todos;
    // 从数组中删除待删除的 todo，并返回删除的元素
    var remove = todos.splice(index, 1)[0];
    // 获取当前的 logs 数组
    var logs = this.data.logs;
    // 将删除的 todo 添加到 logs 数组中
    logs.push({ timestamp: new Date(), action: 'Remove', name: remove.name});
    // 更新页面数据
    this.setData({
      todos: todos, // 更新 todos 数组
      leftCount: this.data.leftCount - (remove.completed ? 0 : 1), // 更新剩余未完成的 todo 的数量
      logs: logs // 更新 logs 数组
    });
    // 保存数据到本地
    this.save();
    // 振动手机
    wx.vibrateShort();
  },
  
  toggleAllHandle: function (e) {
    // 切换全选状态
    this.data.allCompleted = !this.data.allCompleted
    // 获取当前的 todos 数组
    var todos = this.data.todos
    // 遍历 todos 数组，将每个 todo 的 completed 属性改为全选状态
    for (var i = todos.length - 1; i >= 0; i--) {
      todos[i].completed = this.data.allCompleted
    }
    // 获取当前的 logs 数组
    var logs = this.data.logs
    // 将全选/取消全选的操作添加到 logs 数组中
    logs.push({
      timestamp: new Date(),
      action: this.data.allCompleted ? 'Finish' : 'Restart',
      name: 'All todos'
    })
    // 更新页面数据
    this.setData({
      todos: todos, // 更新 todos 数组
      leftCount: this.data.allCompleted ? 0 : todos.length, // 更新剩余未完成的 todo 的数量
      logs: logs // 更新 logs 数组
    })
    // 保存数据到本地
    this.save()
    // 振动手机
    wx.vibrateShort()
  },
  
  clearCompletedHandle: function (e) {
    // 获取当前的 todos 数组
    var todos = this.data.todos
    // 创建一个新的数组，包含未完成的 todo
    var remains = []
    for (var i = 0; i < todos.length; i++) {
      todos[i].completed || remains.push(todos[i])
    }
    // 获取当前的 logs 数组
    var logs = this.data.logs
    // 将清除已完成 todo 的操作添加到 logs 数组中
    logs.push({
      timestamp: new Date(),
      action: 'Clear',
      name: 'Completed todo'
    })
    // 更新页面数据
    this.setData({ todos: remains, logs: logs })
    // 保存数据到本地
    this.save()
    // 显示清除已完成 todo 的提示框，并振动手机
    this.setData({
      toastHidden: false
    })
    wx.vibrateShort()
  },
  
  hideToast: function() {
    // 隐藏清除已完成 todo 的提示框
    this.setData({
      toastHidden: true
    })
  },
  
})