<template>
  <a v-if="data" v-show="!disabled"
    @click="click"
    class="disable-select"
    :class="linkStyle + (disabled ? ' opacity-50' : '')"
    :style="
      (editing ? 'cursor: move' : 'cursor: pointer') +
      '!important; overflow: visible;'
    "
  >
    <span
      v-if="editing && data.is_direct"
      @click="toggleLinkModal(data)"
      class="edit-shadow direct-icon pointer"
    >
      <img
        :src="'https://cdn.tapni.co/icons/direct.png'"
        class="responsive-image"
        :alt="data.text"
      />
    </span>

    <span
      v-if="editing && !isLinksPage"
      class="edit-shadow edit-icon pointer"
    >
      <img
          :src="'https://cdn.tapni.co/icons/edit.png'"
        :alt="data.text"
        class="responsive-image"
      />
    </span>

    <div v-if="isLinksPage" class="edit-icon ios-switch" style="display: inline-block; margin: 0px 0 7px 10px; float: right; width: 45px;">
      <input
          v-model="data.is_active"
          type="checkbox"
          name="ios-switch"
          class="ios-switch-checkbox"
          :id="'link-active-switch-' + data.id"
      />
      <label class="ios-switch-label" :class="{ 'switch-disabled': false }"  :for="'link-active-switch-' + data.id"></label>
    </div>

    <span
      v-if="
        data.type !== 'addlink' &&
        !editing &&
        linkStyle === 'link-list' &&
        switching &&
        !hideExternalIcon
      "
      :class="{
        'edit-icon pointer': true,
        switching: switching,
        'edit-shadow': !switching,
      }"
    >
      <div class="ios-switch">
        <input
          v-model="data.switching"
          type="checkbox"
          name="ios-switch"
          class="ios-switch-checkbox"
          :id="data.id + '-switch'"
        />
        <label class="ios-switch-label" :for="data.id + '-switch'"></label>
      </div>
    </span>
    <span
      v-if="data.type === 'addlink' && !editing && linkStyle === 'link-list'"
      class="edit-shadow edit-icon pointer"
    >
      <img
        :src="'https://cdn.tapni.co/icons/addlink.png'"
        :alt="data.text"
        class="responsive-image"
      />
    </span>

    <span
      :class="{
        'user-link-img': true,
        'pulse pulse-border': pulse,
        'link-drag': editing,
      }"
      :style="{ ...customLinkStyle?.linkIcon }"
    >
      <img
        v-if="!data.custom_icon && data.type !== 'customlink'"
        :src="'https://cdn.tapni.co/icons/' + data.type + '.png'"
        class="responsive-image"
        :alt="data.text"
        @load="$emit('loaded')"
        @error="$emit('loaded')"
      />
      <img
        v-else-if="
          !data.custom_icon && data.type === 'customlink' && linkAdding
        "
        :src="'https://cdn.tapni.co/icons/custom-icon-128.gif'"
        class="responsive-image"
        :alt="data.text"
        @load="$emit('loaded')"
        @error="$emit('loaded')"
      />
      <img
        v-else-if="
          !data.custom_icon && data.type === 'customlink' && !linkAdding
        "
        :src="'https://cdn.tapni.co/icons/customlink.png'"
        class="responsive-image"
        :alt="data.text"
        @load="$emit('loaded')"
        @error="$emit('loaded')"
      />
      <img
        v-else
        :src="data.style.custom_icon"
        style="border-radius: 22.46%"
        class="responsive-image"
        :alt="data.text"
        @load="$emit('loaded')"
        @error="$emit('loaded')"
      />
    </span>

    <span
      class="link-text link-drag color-black"
      :style="{ color: customLinkStyle?.color }"
    >
      {{ linkText }}
      <span v-if="linkSubText && linkStyle === 'link-list'" style="font-size: 11px; display: block; margin-top: -5px;"> {{linkSubText}} </span>
    </span>

    <div
      v-if="
        (data.type !== 'addlink' &&
        editing &&
        linkStyle === 'link-list' &&
        !switching &&
        !hideExternalIcon) && !isLinksPage && false
      "
      @click="editLink(data)"
      class="linkExternal"
      :style="shareIconStyle"
    ></div>
  </a>
</template>

<script>
export default {
  name: "LinkIcon",
  props: {
    linkAdding: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideExternalIcon: {
      type: Boolean,
      required: false,
      default: false,
    },
    switching: {
      type: Boolean,
      required: false,
      default: false,
    },
    pulse: {
      type: Boolean,
      required: false,
      default: false,
    },
    editing: {
      type: Boolean,
      required: false,
      default: true,
    },
    directPick: {
      type: Boolean,
      required: false,
      default: false,
    },
    isLinksPage: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: String,
      required: false,
      default: "",
    },
    linkStyle: {
      type: String,
      required: false,
      default: "link-grid",
    },
    data: {
      type: Object,
      required: true,
    },
    customLinkStyle: {
      type: Object,
      required: false,
      default: () => {},
    },
    shareIconStyle: {
      type: Object,
      required: false,
      default: () => {},
    },
    clickable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  computed: {
    linkText() {
      /*if (this.appLang !== "en" && this.data.text) {
        return (
          this.lang[this.appLang][
            "link_text_" +
              this.data.text.toLowerCase().trim().replace(/ /g, "_")
          ] || this.data.text
        );
      }*/
      return this.data.text;
    },
    linkSubText() {
      // TODO: Fix this and offer Subtext input
      return false;
      if (this.appLang !== "en" && this.data.subtext) {
        return (
            this.lang[this.appLang][
            "link_text_" +
            this.data.subtext.toLowerCase().trim().replace(/ /g, "_")
                ] || this.data.subtext
        );
      }
      return this.data.subtext;
    },
    rules() {
      return this.$store.getters.rules;
    },
  },
  methods: {
    linkClick() {
      console.log('linkClick')
    },
    click() {
      if (this.switching) {
        return (this.data.switching = !this.data.switching);
      }

      if (!this.clickable) return;

      if (this.data.id && !this.editing && !this.directPick) {
        this.linkClick(this.data);

        if (this.data.type === 'wechat') {
          return this.copy(this.data.url);
        }

        if (this.data.type === 'contactcard') {
          // this.data.url = this.data.url.replace('https://api.tapni.co', 'http://192.168.1.8:8888');
            return this.downloadContent(this.data.url, true);
        }

        this.redirectLink(this.data);
      } else if (this.to) {
        if (!this.rules.addLinks)
          return true;// EventBus.$emit("toggleForbiddenRuleModal");
        else this.$router.push(this.to);
      } else if (this.directPick) {
        this.$emit("directPick", this.data);
      } else if (this.editing) {
        this.editLink(this.data);
      }
    },
    editLink(data) {
      if (!this.rules.editCompanyLinks && data.CompanyId)
        return true; //EventBus.$emit("toggleForbiddenRuleModal");
      this.toggleLinkModal(data);
    },
    /*toggleLinkModal(link) {
      if (link.type === "contactcard")
        EventBus.$emit("toggleContactCardModal", link);
      else if (link.type === "googlereview")
        EventBus.$emit("toggleGoogleReviewModal", link);
      else EventBus.$emit("toggleLinkModal", link);
    }*/
  },
  watch: {
    'data.is_active' () {
      this.$emit('linkSwitch', this.data);
      this.$forceUpdate();
    }
  }
};
</script>

<style>
/* ********* */
/* Link Grid */
/* ********* */
.link-grid,
.user-link-img {
  width: 100%;
  max-width: 170px;
  display: inline-table;
  position: relative;
}

.link-grid {
  width: 30%;
  margin: 1.6%;
  padding: 1.6%;
}

.link-grid .user-link-img img {
  /* box-shadow: 0px 2px 10px rgba(200,200,200,0.8); */
  /* border: 1px solid #e8e8e8; */
  border-radius: 25% !important;
}

.link-grid .edit-icon {
  border-radius: 20px;
  right: -3%;
  top: -3%;
  position: absolute;
  z-index: 3;
  max-width: 23%;
  overflow: hidden;
  min-width: 30px;
}

.link-grid .direct-icon {
  border-radius: 20px;
  left: -3%;
  top: -3%;
  position: absolute;
  z-index: 555;
  max-width: 23%;
  overflow: hidden;
  min-width: 30px;
}

.link-grid .link-text {
  min-height: 20px;
  margin-top: 3px !important;
  display: block;
  text-align: center;
  line-height: normal;
  overflow-wrap: anywhere;
}

/* ********* */
/* Link List */
/* ********* */
.link-list {
  width: 93%;
  max-width: 600px;
  max-height: 67px !important;
  margin: 0px auto;
  display: flex;
  border-radius: 15px !important;
  background-color: #ffffff;
  /* box-shadow: 0px 2px 5px rgba(0,0,0,0.15); */
  border: solid 1px #e8e8e8;
  position: relative;
  align-items: center;
}

.link-list .user-link-img {
  display: inline-block;
  width: 65px;
  /* box-shadow: 0px 3px 6px rgba(0,0,0,0.16); */
  border-radius: 25% !important;
}

.link-list .link-text {
  display: inline-block;
  padding: 18px 0% 17px 10%;
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  flex: 1;
  text-align: left;
  border-radius: 15px !important;
}

.link-list .edit-icon {
  border-radius: 20px;
  right: 7%;
  top: 30%;
  position: absolute;
  z-index: 3;
  width: 26px;
  overflow: hidden;
}

.link-list .switching {
  width: 45px;
}

.link-list .direct-icon {
  border-radius: 20px;
  left: -2%;
  top: -13%;
  position: absolute;
  z-index: 555;
  width: 26px;
  overflow: hidden;
}
/* ********* */

.small {
  width: 22% !important;
  margin: 2% 4% 0%;
  padding: 0%;
}
.small .link-text {
  margin-top: 0px !important;
  font-size: 13px;
}

.linkExternal {
  margin-right: 20px;
  width: 20px;
  display: inline-block !important;
  height: 20px;
  background: black;
  -webkit-mask: url(https://cdn.tapni.co/icons/link-external.svg) no-repeat
    center;
  mask: url(https://cdn.tapni.co/icons/link-external.svg) no-repeat center;
  transform: scale(1.5);
}
</style>
