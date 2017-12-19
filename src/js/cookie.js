const cookie = (function () {
  return {
    setCookie(cName, value, expiredays) {
      // console.log(cName, value, expiredays)
      const exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      // document.cookie = cName + '=' + escape(value) + ((expiredays == null)
      // ? '' : ';expires=' + exdate.toGMTString());
      document.cookie = `${cName} = ${escape(value)}`;
    },
    getCookie(name) {
      const reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
      const arr = document.cookie.match(reg);
      return arr ? arr[2] : null;
    },
    delCookie(name) {
      const exp = new Date();
      exp.setTime(exp.getTime() - 1);
      const cval = this.getCookie(name);
      if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
      }
    },
  };
}());

export default cookie;
