<template>
  <div>
    <section class="login-block">
      <div class="container">
        <div class="row">
          <div class="col-md-4 login-sec">
            <h2 class="text-center">Login Now</h2>
            <div class="login-form">
              <p class="msg-error-login" v-if="msg">{{ msg }}</p>
              <div class="form-group">
                <label for="exampleInputEmail1">Username</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  v-model="username"
                />
                <span class="msg-error">{{ error_mgs.username }}</span>
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input
                  type="password"
                  class="form-control"
                  placeholder=""
                  v-model="password"
                />
                <span class="msg-error">{{ error_mgs.password }}</span>
              </div>

              <div>
                <b-link to="forgot">Forgot password?</b-link>
                <button
                  class="btn btn-login float-right"
                  @click="onLogin"
                  :disabled="isLoading"
                >
                  <b-spinner
                    v-if="isLoading"
                    variant="primary"
                    small
                  ></b-spinner>
                  Login
                </button>
              </div>
            </div>
          </div>
          <div class="col-md-8 banner-sec">
            <div
              id="carouselExampleIndicators"
              class="carousel slide"
              data-ride="carousel"
            >
              <ol class="carousel-indicators">
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to="0"
                  class="active"
                ></li>
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to="1"
                ></li>
                <li
                  data-target="#carouselExampleIndicators"
                  data-slide-to="2"
                ></li>
              </ol>
              <div class="carousel-inner" role="listbox">
                <div class="carousel-item active">
                  <img
                    class="d-block img-fluid"
                    src="https://static.pexels.com/photos/33972/pexels-photo.jpg"
                    alt="First slide"
                  />
                  <div class="carousel-caption d-none d-md-block"></div>
                </div>
                <div class="carousel-item">
                  <img
                    class="d-block img-fluid"
                    src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg"
                    alt="First slide"
                  />
                  <div class="carousel-caption d-none d-md-block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data: () => ({
    username: null,
    password: null,
    isLoading: false,
    error_mgs: {
      username: '',
      password: ''
    },
    msg: null
  }),
  methods: {
    async onLogin () {
      let isError = false
      if (!this.username) {
        isError = true
        this.error_mgs.username = 'Please fill username'
      } else {
        this.error_mgs.username = ''
      }
      if (!this.username) {
        isError = true
        this.error_mgs.password = 'Please fill password'
      } else {
        this.error_mgs.password = ''
      }
      if (!isError) {
        this.isLoading = true
        const user = {
          username: this.username,
          password: this.password
        }
        const data = await this.$store.dispatch('auth/login', user)
        this.isLoading = false
        if (data) {
          this.$router.push('/')
        } else {
          this.msg = 'Incorrect username or password.'
        }
      }
    }
  }
}
</script>

<style scoped>
.login-block {
  background: #330e97; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to bottom,
    #5e37eb,
    #7962de
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to bottom,
    #322769,
    #15747d
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  float: left;
  width: 100%;
  padding: 107px 0;
  min-height: 100vh;
}
.banner-sec {
  background: url(https://static.pexels.com/photos/33972/pexels-photo.jpg)
    no-repeat left bottom;
  background-size: cover;
  min-height: 500px;
  border-radius: 0 10px 10px 0;
  padding: 0;
}
.container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 15px 20px 0px rgba(0, 0, 0, 0.1);
}
.carousel-inner {
  border-radius: 0 10px 10px 0;
}
.carousel-caption {
  text-align: left;
  left: 5%;
}
.login-sec {
  padding: 50px 30px;
  position: relative;
}
.login-sec .copy-text {
  position: absolute;
  width: 80%;
  bottom: 20px;
  font-size: 13px;
  text-align: center;
}
.login-sec .copy-text i {
  color: #feb58a;
}
.login-sec .copy-text a {
  color: #e36262;
}
.login-sec h2 {
  margin-bottom: 30px;
  font-weight: 800;
  font-size: 30px;
  color: #3b3fbf;
}
.login-sec h2:after {
  content: " ";
  width: 100px;
  height: 5px;
  background: #50c7c2;
  display: block;
  margin-top: 20px;
  border-radius: 3px;
  margin-left: auto;
  margin-right: auto;
}
.btn-login {
  background: #3b3fbf;
  color: #fff;
  font-weight: 600;
}
.banner-text {
  width: 70%;
  position: absolute;
  bottom: 40px;
  padding-left: 20px;
}
.banner-text h2 {
  color: #fff;
  font-weight: 600;
}
.banner-text h2:after {
  content: " ";
  width: 100px;
  height: 5px;
  background: #fff;
  display: block;
  margin-top: 20px;
  border-radius: 3px;
}
.banner-text p {
  color: #fff;
}
.msg-error-login {
  padding-top: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
  font-size: 15px;
  color: red;
}
</style>
