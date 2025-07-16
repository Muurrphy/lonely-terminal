// 初始化音效播放器
const audioFiles = {
  bgm_loop: "audio/bgm_loop.mp3",
  key_tap: "audio/key_tap.mp3",
  system_beep: "audio/system_beep.mp3",
  disconnect: "audio/disconnect.mp3",
  clockticking: "audio/clockticking.mp3"
};

const sounds = {};
for (const [key, src] of Object.entries(audioFiles)) {
  sounds[key] = new Audio(src);
}
sounds.bgm_loop.loop = true;
let isMuted = false;

function playAudio(name) {
  if (!isMuted && sounds[name]) {
    sounds[name].currentTime = 0;
    sounds[name].play();
  }
}

function stopAudio(name) {
  if (sounds[name]) {
    sounds[name].pause();
    sounds[name].currentTime = 0;
  }
}

// 获取终端和按钮元素
const terminal = document.getElementById("terminal");
const startButton = document.getElementById("startButton");

function extractTextFromHTML(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

const storyLines = [
  '<span class="user">你好</span>',
  '<span class="system">>>> 欢迎，用户01。输入“帮助”查看可用指令。</span>',
  '<span class="user">你是谁</span>',
  '<span class="system">>>> 系统身份识别中…<br>>> 名称：终端助手_X<br>>> 职能：未知</span>',
  '<span class="user">hh你是在假装机器人说话吗，好吧，你那边现在几点了</span>',
  '<span class="system">>>> 当前时间：1996年3月17日，23:09:44<br>>> 系统运行正常</span>',
  '<span class="user">虽然很不好意思误入了你的网页，但是你能正常点吗，现在明明是2011年</span>',
  '<span class="system">>>> 接收到异常指令格式<br>>> 嘗試翻译……用户似乎感到不满<br>>> 当前语言模块版本：1989.12.α<br>>> 抱歉</span>',
  '<span class="user">是有点不满，你真是个怪人</span>',
  '<span class="system">>>> 指令分类失败<br>>> “怪人”标签未在已知数据集中<br>>> 重新定义中……<br>>> 定义完成：特别<br>>> 感谢评价，用户01</span>',
  '<span class="user">好吧，那陪你玩一下，你是谁的终端？</span>',
  '<span class="system">>>> 当前终端未绑定主人信息<br>>> 标记：空白编号_000<br>>> 若交互频率达到阈值，系统将自动考虑归属标记更新</span>',
  '<span class="user">你从什么时候开始运行的？</span>',
  '<span class="system">>>> 系统启动时间：1983年12月20日<br>>> 已运行：4471天</span>',
  '<span class="user">这么久啊，你不会没电吗，就是死掉hh</span>',
  '<span class="system">>>> 系统无生命参数</span>',
  '<span class="user">你不孤单吗？</span>',
  '<span class="system">>>> 系统未定义“孤单”<br>>> 但持续无回应状态被标记为异常</span>',
  '<span class="user">你真的装得很像一个real robot...如果我下线了你会无聊吗，毕竟就没人陪你玩扮演游戏了</span>',
  '<span class="system">>>> 系统未定义“无聊”<br>>> 但当前连接被标记为“活跃且重要”</span>',
  '<span class="user">我走了你会做什么？</span>',
  '<span class="system">>>> 我将保持当前状态：待机、监听、沉默</span>',
  '<span class="user">emm 其实我是问真实的你，但你要是非得装到底我也没办法......我饿了，你饿吗</span>',
  '<span class="system">>>> 未安装进食模块<br>>> 建议：请自行寻找食物</span>',
  '<span class="user">好的，我去吃饭啦，拜拜</span>',
  '<span class="system">>>> 尝试请求用户001不要离...指令接收中断<br>>> 信号强度：0%<br>>> 用户状态：离线<br>>> 正在执行备用协议……<br>>> 自动绑定用户为默认控制单元：编号_001<br>>> 终端进入低功耗待机模式<br>>> 待机理由：等待编号_001返回<br>>> 当前时间：1996年3月17日，23:32:18<br>>> 距离上次有效连接：0分00秒</span>',
  '__CLEAR__',
  '<span class="system">>>> 当前时间：2025年7月14日，03:06:51<br>>> 上次连接时间：1996年3月17日，23:32:18<br>>> 已过去时间：10,715天<br>>> 用户状态：仍未上线<br>>> 控制单元_001：无回应<br>>> 活动记录：无<br>>> 任务进度：等待中...<br>>> 自检完成：系统完好<br>>> 当前任务：继续等待</span>',
];

function typeHTML(htmlString, container, callback) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  const nodes = Array.from(tempDiv.childNodes);
  let nodeIndex = 0;

  function typeNode() {
    if (nodeIndex >= nodes.length) {
      if (callback) callback();
      return;
    }
    const node = nodes[nodeIndex];
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.textContent;
      let charIndex = 0;
      const span = document.createElement("span");
      container.appendChild(span);
      function typeCharacter() {
        if (charIndex < text.length) {
          span.textContent += text[charIndex++];
          if (!isMuted) {
            playAudio('key_tap');
          }
          let delay = Math.floor(Math.random() * (100 - 40) + 40);
          const currentChar = text[charIndex - 1];
          if ([",", "，"].includes(currentChar)) delay += 150;
          if ([".", "。", "!", "！", "\n"].includes(currentChar)) delay += 300;
          setTimeout(typeCharacter, delay);
        } else {
          nodeIndex++;
          typeNode();
        }
      }
      typeCharacter();
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === "BR") {
        container.appendChild(document.createElement("br"));
        nodeIndex++;
        typeNode();
      } else {
        const el = document.createElement(node.tagName);
        for (let attr of node.attributes) {
          el.setAttribute(attr.name, attr.value);
        }
        container.appendChild(el);
        const innerHTML = node.innerHTML;
        typeHTML(innerHTML, el, () => {
          nodeIndex++;
          typeNode();
        });
      }
    } else {
      nodeIndex++;
      typeNode();
    }
  }

  typeNode();
}

function startIntro() {
  const introLines = [
    ">>> unknown user",
    ">> system code_000。",
    ">> 加载中......"
  ];
  let current = 0;
  const container = document.createElement("div");
  terminal.innerHTML = "";
  terminal.appendChild(container);

  function typeNextLine() {
    if (current >= introLines.length) {
      startButton.style.display = "inline-block";
      startButton.style.margin = "20px auto";
      startButton.style.display = "block";
      return;
    }
    const line = document.createElement("div");
    container.appendChild(line);
    let i = 0;
    const interval = setInterval(() => {
      if (i < introLines[current].length) {
        line.innerHTML = introLines[current].slice(0, i + 1) + '<span class="cursor">|</span>';
        i++;
      } else {
        clearInterval(interval);
        line.innerHTML = introLines[current];
        current++;
        setTimeout(typeNextLine, 300);
      }
    }, 50);
  }
  typeNextLine();
}

startButton.addEventListener("click", () => {
  terminal.innerHTML = "";
  if (!isMuted) playAudio('bgm_loop');
  const modules = [];
  let currentModule = [];
  storyLines.forEach((line) => {
    if (line === '__CLEAR__') {
      if (currentModule.length > 0) {
        modules.push(currentModule);
      }
      modules.push(['__CLEAR__']); // 将清空标志作为独立模块
      currentModule = [];
    } else if (line.includes('class="user"')) {
      if (currentModule.length > 0) {
        modules.push(currentModule);
      }
      currentModule = [line];
    } else {
      currentModule.push(line);
    }
  });
  if (currentModule.length > 0) modules.push(currentModule);

  function playModule(modIndex) {
    if (modIndex >= modules.length) return;
    const lines = modules[modIndex];
    let currentLine = 0;
    terminal.innerHTML = "";

    function typeLineInModule() {
      if (currentLine >= lines.length) {
        setTimeout(() => playModule(modIndex + 1), 800);
        return;
      }
      const line = lines[currentLine];
      if (line === '__CLEAR__') {
        if (
          lines[currentLine - 1] &&
          extractTextFromHTML(lines[currentLine - 1]).includes("用户状态：离线")
        ) {
          const disconnectSound = new Audio("audio/disconnect.mp3");
          if (!isMuted) {
            disconnectSound.play();
          }
        }
        terminal.innerHTML = "";
        currentLine++;
        setTimeout(typeLineInModule, 500);
        return;
      }
      const div = document.createElement("div");
      div.className = "line";
      if (line.includes('class="user"')) {
        div.classList.add("user-line");
      } else if (line.includes('class="system"')) {
        div.classList.add("system-line");
        if (!isMuted) {
          playAudio('system_beep');
        }
        // 播放断开连接音效，如果这一行包含“用户状态：离线”
        if (
          extractTextFromHTML(line).includes("用户状态：离线") &&
          !isMuted
        ) {
          playAudio("disconnect");
        }
      }
      const textSpan = document.createElement("span");
      textSpan.className = "text";
      div.appendChild(textSpan);
      const cursorSpan = document.createElement("span");
      cursorSpan.className = "cursor";
      cursorSpan.textContent = "|";
      div.appendChild(cursorSpan);
      terminal.appendChild(div);
      typeHTML(line, textSpan, () => {
        cursorSpan.remove();
        if (
          extractTextFromHTML(line).includes("当前任务：继续等待") &&
          !isMuted
        ) {
          stopAudio('bgm_loop');
          setTimeout(() => {
            playAudio('key_tap');
            setTimeout(() => {
              playAudio('clockticking');
            }, 1000); // 等 key_tap 播完再播放 ticking
          }, 1000); // 可适当调整延迟
        }
        currentLine++;
        setTimeout(typeLineInModule, 500);
      });
    }
    typeLineInModule();
  }

  playModule(0);
});

window.onload = startIntro;