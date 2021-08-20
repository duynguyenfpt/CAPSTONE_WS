<template>
  <div>
    <section id="error">
      <div class="content">
        <i class="fa fa-warning fas fa-exclamation-triangle"></i>
        <h1>403</h1>
        <p>Error occurred! - Access Denied</p>
      </div>
    </section>
  </div>
</template>
<style scoped>
@import url("https://fonts.googleapis.com/css?family=Sniglet:400,800");

body {
  background: #95a5a6;
  font-family: "Sniglet", cursive;
}
h1 {
  text-align: center;
  font-size: 190px;
  font-weight: 400;
  margin: 0;
}
.fa {
  font-size: 120px;
  text-align: center;
  display: block;
  padding-top: 100px;
  margin: 0 auto;
  color: #a93226;
}
#error p {
  text-align: center;
  font-size: 36px;
  color: #a93226;
}
a.back {
  text-align: center;
  margin: 0 auto;
  display: block;
  text-decoration: none;
  font-size: 24px;
  background: #ba4a00;
  border-radius: 10px;
  width: 10%;
  padding: 4px;
  color: #fff;
}
footer p {
  padding-top: 160px;
  text-align: center;
}
a.w3hubs {
  text-decoration: none;
  color: #a93226;
}

@media (max-width: 550px) {
  a.back {
    width: 20%;
  }
}
@media (max-width: 425px) {
  h1 {
    padding-top: 20px;
  }
  .fa {
    padding-top: 100px;
  }
}
</style>
