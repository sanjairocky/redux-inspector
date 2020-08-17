const gulp = require("gulp");

const browserify = require("browserify");
const fs = require("fs");
const terser = require("terser");

const bundler = browserify({ standalone: "redux-emitter" });

bundler.add("src/index.js");

function bundle(done) {
  bundler.bundle(function (err, source) {
    if (err) {
      console.error(err);
    }

    //generateBndle - to gen bundle
    console.log("Generating ReduxEmitter.js ");
    fs.writeFileSync("out/ReduxEmitter.js", source);

    const result = terser.minify(source.toString());
    if (result.code) {
      console.log("Generating ReduxEmitter.min.js");
      fs.writeFileSync("out/ReduxEmitter.min.js", result.code, "utf8");
    } else {
      console.log(result.error);
    }
  });

  done();
}

gulp.task("dev", function () {
  gulp.watch("src/*", bundle);
});

gulp.task("build", function (done) {
  bundle(done);
});
