// 访问统计功能
let fangwen = {
  init: function () {
    const today = new Date().toDateString();
    const lastVisit =
      localStorage.getItem("lastVisit") || new Date().toISOString();
    const totalVisits = parseInt(localStorage.getItem("totalVisits")) || 0;
    const todayVisits = parseInt(localStorage.getItem(today)) || 0;

    // 更新统计
    localStorage.setItem("totalVisits", totalVisits + 1);
    localStorage.setItem(today, todayVisits + 1);
    localStorage.setItem("lastVisit", new Date().toISOString());

    // 显示统计
    document.getElementById("totalVisits").textContent = totalVisits + 1;
    document.getElementById("todayVisits").textContent = todayVisits + 1;

    // 计算最后访问时间
    const lastVisitDate = new Date(lastVisit);
    const now = new Date();
    const diffMinutes = Math.floor((now - lastVisitDate) / (1000 * 60));

    let lastVisitText;
    if (diffMinutes < 1) {
      lastVisitText = "刚刚";
    } else if (diffMinutes < 60) {
      lastVisitText = `${diffMinutes}分钟前`;
    } else if (diffMinutes < 1440) {
      lastVisitText = `${Math.floor(diffMinutes / 60)}小时前`;
    } else {
      lastVisitText = `${Math.floor(diffMinutes / 1440)}天前`;
    }

    document.getElementById("lastVisit").textContent = lastVisitText;
  },
};

// 音乐功能模块
let yinyue = {
  init: function () {
    // 加载保存的音乐
    let savedMusic = localStorage.getItem("yinyue_data");
    if (savedMusic) {
      let musicData = JSON.parse(savedMusic);
      this.setMusic(musicData.url);
    }

    // 修复音乐播放器ID不匹配问题
    let musicPlayer = document.getElementById("bgMusic");
    if (!musicPlayer) {
      console.error("音乐播放器元素未找到");
      return;
    }

    // 事件监听
    let changeBtn = document.getElementById("yinyue_change");
    if (changeBtn) {
      changeBtn.addEventListener("click", () => {
        document.getElementById("yinyue_upload").click();
      });
    }

    let clearBtn = document.getElementById("yinyue_clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("确定要清除背景音乐吗？")) {
          localStorage.removeItem("yinyue_data");
          location.reload();
        }
      });
    }

    document.getElementById("yinyue_upload").addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        this.handleUpload(e.target.files[0]);
      }
    });
  },

  handleUpload: function (file) {
    if (!file.type.startsWith("audio/")) {
      alert("请选择音频文件");
      return;
    }

    let reader = new FileReader();
    reader.onload = (e) => {
      let musicData = {
        url: e.target.result,
        name: file.name,
      };
      localStorage.setItem("yinyue_data", JSON.stringify(musicData));
      this.setMusic(musicData.url);
    };
    reader.readAsDataURL(file);
  },

  setMusic: function (url) {
    let player = document.getElementById("bgMusic");
    if (!player) return;

    let source = player.querySelector("source");
    if (!source) {
      source = document.createElement("source");
      source.type = "audio/mpeg";
      player.appendChild(source);
    }
    source.src = url;
    player.load();
  },
};

// 点赞功能模块
let dianzan = {
  init: function () {
    this.initToggleLike("dianzan_box1", "dianzan_heart1", "dianzan_count1");
    this.initSingleLike("dianzan_box2", "dianzan_heart2", "dianzan_count2");
  },

  initToggleLike: function (boxId, heartId, countId) {
    let box = document.getElementById(boxId);
    let heart = document.getElementById(heartId);
    let count = document.getElementById(countId);

    if (!box || !heart || !count) {
      console.error("点赞元素未找到:", boxId, heartId, countId);
      return;
    }

    // 加载保存状态
    let savedCount = localStorage.getItem(countId);
    if (savedCount) count.textContent = savedCount;

    box.addEventListener("click", () => {
      let current = parseInt(count.textContent) + 1;
      count.textContent = current;
      localStorage.setItem(countId, current);

      heart.classList.toggle("gray");
      heart.classList.toggle("red");
    });
  },

  initSingleLike: function (boxId, heartId, countId) {
    let box = document.getElementById(boxId);
    let heart = document.getElementById(heartId);
    let count = document.getElementById(countId);

    if (!box || !heart || !count) {
      console.error("点赞元素未找到:", boxId, heartId, countId);
      return;
    }

    // 加载保存状态
    let savedCount = localStorage.getItem(countId);
    let hasLiked = localStorage.getItem(heartId + "_liked") === "true";

    if (savedCount) count.textContent = savedCount;
    if (hasLiked) {
      heart.classList.remove("gray");
      heart.classList.add("red");
    }

    box.addEventListener("click", () => {
      if (!hasLiked) {
        let current = parseInt(count.textContent) + 1;
        count.textContent = current;
        localStorage.setItem(countId, current);
        localStorage.setItem(heartId + "_liked", "true");
        heart.classList.remove("gray");
        heart.classList.add("red");
        hasLiked = true;
      }
    });
  },
};

// 计算器功能模块
let jisuan = {
  init: function () {
    this.screen = document.getElementById("jisuan_screen");
    if (!this.screen) {
      console.error("计算器屏幕元素未找到");
      return;
    }

    // 数字和运算符按钮
    let buttons = document.querySelectorAll(".jisuan_btn");
    if (buttons.length === 0) {
      console.error("计算器按钮未找到");
      return;
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.appendToScreen(btn.dataset.value);
      });
    });

    // 特殊按钮
    let equalBtn = document.getElementById("jisuan_equal");
    if (equalBtn) {
      equalBtn.addEventListener("click", () => {
        this.calculate();
      });
    }

    let clearBtn = document.getElementById("jisuan_clear");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.clearScreen();
      });
    }
  },

  appendToScreen: function (value) {
    if (this.screen.textContent === "0" && !isNaN(value)) {
      this.screen.textContent = value;
    } else {
      this.screen.textContent += value;
    }
  },

  clearScreen: function () {
    this.screen.textContent = "0";
  },

  calculate: function () {
    try {
      let expr = this.screen.textContent.replace(/×/g, "*").replace(/÷/g, "/");
      this.screen.textContent = eval(expr);
    } catch {
      this.screen.textContent = "错误";
    }
  },
};

// 记事本功能
let notes = {
  init: function () {
    // 加载保存的笔记
    let savedNotes = localStorage.getItem("personalNotes");
    if (savedNotes) {
      document.getElementById("personalNotes").value = savedNotes;
    }

    // 自动保存功能
    document
      .getElementById("personalNotes")
      .addEventListener("input", function () {
        localStorage.setItem("personalNotes", this.value);
      });
  },

  save: function () {
    let noteContent = document.getElementById("personalNotes").value;
    localStorage.setItem("personalNotes", noteContent);
    alert("笔记已保存！");
  },
};

// 初始化所有功能
document.addEventListener("DOMContentLoaded", () => {
  fangwen.init();
  yinyue.init();
  dianzan.init();
  jisuan.init();
  notes.init();

  // 暴露保存函数到全局
  window.saveNotes = notes.save;
});
// 在script.js末尾添加（DOMContentLoaded事件内）
const imageSwitcher = {
  init: function () {
    const images = ["22.jpg", "23.jpg", "1.png"];
    let currentIndex = 0;
    const imgElement = document.querySelector(
      '.x.baise[style*="height: 30%"] img.tupian'
    );

    if (imgElement) {
      imgElement.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        imgElement.src = images[currentIndex];
      });
    }
  },
};

// 初始化时调用
document.addEventListener("DOMContentLoaded", () => {
  // ...原有初始化代码...
  imageSwitcher.init(); // 新增此行
});
// 个人资料功能模块
// 个人资料功能模块
const profileManager = {
  init: function () {
    // 获取元素
    this.profileHeader = document.getElementById("profileHeader");
    this.profilePanel = document.getElementById("profilePanel");
    this.closeBtn = document.getElementById("closeProfile");
    this.profileForm = document.getElementById("profileForm");

    // 如果没有找到元素则退出
    if (!this.profileHeader || !this.profilePanel) return;

    // 加载保存的资料数据（会自动更新所有位置的昵称显示）
    this.loadProfileData();

    // 添加事件监听
    this.profileHeader.addEventListener(
      "click",
      this.toggleProfilePanel.bind(this)
    );
    this.closeBtn.addEventListener("click", this.hideProfilePanel.bind(this));
    this.profileForm.addEventListener(
      "submit",
      this.saveProfileData.bind(this)
    );

    // 点击面板外部关闭面板
    document.addEventListener("click", (e) => {
      if (
        !this.profilePanel.contains(e.target) &&
        !this.profileHeader.contains(e.target)
      ) {
        this.hideProfilePanel();
      }
    });
  },

  // 显示/隐藏资料面板
  toggleProfilePanel: function (e) {
    e.stopPropagation(); // 阻止事件冒泡

    // 如果点击的是头像栏内的元素
    if (this.profileHeader.contains(e.target)) {
      if (this.profilePanel.style.display === "block") {
        this.hideProfilePanel();
      } else {
        this.showProfilePanel();
      }
    }
  },

  showProfilePanel: function () {
    this.profilePanel.style.display = "block";
  },

  hideProfilePanel: function () {
    this.profilePanel.style.display = "none";
  },

  // 加载保存的资料数据
  loadProfileData: function () {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      const profileData = JSON.parse(savedProfile);
      const name = profileData.name || "双翼的天使";

      // 填充表单数据
      document.getElementById("profileName").value = name;
      document.getElementById("profileAge").value = profileData.age || "";
      document.getElementById("profileBirthday").value =
        profileData.birthday || "";
      document.getElementById("profileAddress").value =
        profileData.address || "";
      document.getElementById("profileHobbies").value =
        profileData.hobbies || "";

      // 更新所有位置的昵称显示
      this.updateAllNameDisplays(name);
    }
  },

  // 保存资料数据
  saveProfileData: function (e) {
    e.preventDefault();

    // 收集表单数据
    const newName = document.getElementById("profileName").value;
    const profileData = {
      name: newName,
      age: document.getElementById("profileAge").value,
      birthday: document.getElementById("profileBirthday").value,
      address: document.getElementById("profileAddress").value,
      hobbies: document.getElementById("profileHobbies").value,
    };

    // 保存到本地存储
    localStorage.setItem("userProfile", JSON.stringify(profileData));

    // 更新所有位置的昵称显示
    this.updateAllNameDisplays(newName);

    // 隐藏面板
    this.hideProfilePanel();

    // 显示保存成功的提示
    alert("资料保存成功！");
  },

  // ▼▼▼ 新增方法：统一更新所有位置的昵称显示 ▼▼▼
  updateAllNameDisplays: function (name) {
    // 1. 更新浏览器标签页标题
    document.title = `${name}的空间`;

    // 2. 更新头部大标题（根据实际HTML结构调整选择器）
    const mainTitle = document.querySelector(".zwb.zt");
    if (mainTitle) {
      mainTitle.textContent = `欢迎来到${name}的空间`;
    }

    // 3. 更新头像旁昵称
    const nicknameElement = document.querySelector(".nichen");
    if (nicknameElement) {
      nicknameElement.textContent = name;
    }
  },
};

// 在DOMContentLoaded事件监听器中初始化
document.addEventListener("DOMContentLoaded", () => {
  // ...其他模块的初始化代码...
  profileManager.init(); // 初始化个人资料模块
});
