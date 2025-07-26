// 切换登录/注册标签
function switchTab(tabName) {
  // 隐藏所有内容
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.remove("active");
  });

  // 取消所有标签的活动状态
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // 显示选中的内容
  document.getElementById(tabName).classList.add("active");

  // 设置选中标签的活动状态
  document
    .querySelector(`.tab[onclick="switchTab('${tabName}')"]`)
    .classList.add("active");

  // 清空消息
  document.getElementById("message").textContent = "";
}

// 注册功能
document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      document.getElementById("message").textContent = "两次输入的密码不一致";
      return;
    }

    // 检查用户名是否已存在
    const users = JSON.parse(localStorage.getItem("users")) || {};
    if (users[username]) {
      document.getElementById("message").textContent = "用户名已存在";
      return;
    }

    // 保存用户信息
    users[username] = password;
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("message").textContent = "注册成功，请登录";
    switchTab("login");

    // 清空表单
    this.reset();
  });

// 登录功能
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  // 获取用户数据
  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[username]) {
    document.getElementById("message").textContent = "用户名不存在";
    return;
  }

  if (users[username] !== password) {
    document.getElementById("message").textContent = "密码错误";
    return;
  }

  // 登录成功
  document.getElementById("message").textContent = "登录成功";
  localStorage.setItem("currentUser", username);

  // 2秒后跳转到主页
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
});
