<template>
    <div class="top-menu">
      <div class="menu-items">
        <router-link to="/blockeditor" class="menu-item" title="Block Editor">
          <i class="fa-regular fa-cube"></i>
        </router-link>
        <router-link to="/markdowneditor" class="menu-item" title="Markdown Editor">
          <i class="fa-regular fa-hashtag"></i>
        </router-link>
        <router-link to="/jsoneditor" class="menu-item" title="JSON Editor">
          <i class="fa-regular fa-brackets-curly"></i>
        </router-link>
      </div>
      <div class="menu-item full-screen" @click="toggleFullScreen" title="Toggle Full Screen">
        <i class="fas fa-expand"></i>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TopMenu',
    methods: {
      switchEditor(type) {
        console.log(`Switching to ${type} editor`);
        // Add logic to switch editor types
      },
      toggleFullScreen() {
        const doc = document.documentElement;
        if (!document.fullscreenElement) {
          if (doc.requestFullscreen) {
            doc.requestFullscreen();
          } else if (doc.mozRequestFullScreen) { // Firefox
            doc.mozRequestFullScreen();
          } else if (doc.webkitRequestFullscreen) { // Chrome, Safari and Opera
            doc.webkitRequestFullscreen();
          } else if (doc.msRequestFullscreen) { // IE/Edge
            doc.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
          }
        }
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>

  .top-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f4f4f4;
    padding: 10px 20px;
    border-bottom: 1px solid #ddd;
    position:absolute;
    width:100%;
    z-index: 999;
  }
  
  .menu-items {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
  
  .menu-item {
    cursor: pointer;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .menu-item i {
    font-size: 20px;
  }
  
  .menu-item:hover {
    background-color: #eaeaea;
  }
  
  .full-screen {
    margin-left: auto;
  }
  </style>
  