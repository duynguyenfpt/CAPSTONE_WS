<template>
  <div>
    <section class="login-block">
      <div class="container">
        <div class="row">
          <div class="col-md-4 login-sec">
            <h2 class="text-center">Login Now</h2>
            <div class="login-form">
              <div class="form-group">
                <label for="exampleInputEmail1" class="text-uppercase"
                  >Username</label
                >
                <input
                  type="text"
                  class="form-control"
                  placeholder=""
                  v-model="username"
                />
              </div>
              <div class="form-group">
                <label for="exampleInputPassword1" class="text-uppercase"
                  >Password</label
                >
                <input
                  type="password"
                  class="form-control"
                  placeholder=""
                  v-model="password"
                />
              </div>

              <div class="form-check">
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" />
                  <small>Remember Me</small>
                </label>
                <button class="btn btn-login float-right" @click="onLogin">
                  Submit
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
                  <div class="carousel-caption d-none d-md-block">
                    <div class="banner-text">
                      <h2>This is Heaven</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation
                      </p>
                    </div>
                  </div>
                </div>
                <div class="carousel-item">
                  <img
                    class="d-block img-fluid"
                    src="https://images.pexels.com/photos/7097/people-coffee-tea-meeting.jpg"
                    alt="First slide"
                  />
                  <div class="carousel-caption d-none d-md-block">
                    <div class="banner-text">
                      <h2>This is Heaven</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation
                      </p>
                    </div>
                  </div>
                </div>
                <div class="carousel-item">
                  <img
                    class="d-block img-fluid"
                    src="https://images.pexels.com/photos/872957/pexels-photo-872957.jpeg"
                    alt="First slide"
                  />
                  <div class="carousel-caption d-none d-md-block">
                    <div class="banner-text">
                      <h2>This is Heaven</h2>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation
                      </p>
                    </div>
                  </div>
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
import { login } from '@/service/authen'

export default {
  layout: 'auth',
  data: () => ({
    username: null,
    password: null
  }),
  methods: {
    async onLogin () {
      const data = {
        username: this.username,
        password: this.password

      }
      const res = await login(data)
      console.log(res.token)
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
</style>
