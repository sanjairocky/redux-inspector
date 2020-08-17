const gulp = require("gulp");

const browserify = require("browserify");
const fs = require("fs");
const terser = require("terser");

const bundler = browserify({ standalone: "redux-inspector" });

bundler.add("src/index.js");

function bundle(done) {
  bundler.bundle(function (err, source) {
    if (err) {
      console.error(err);
    }

    //generateBndle - to gen bundle
    console.log("Generating ReduxInspector.js ");
    fs.writeFileSync("out/ReduxInspector.js", source);

    const result = terser.minify(source.toString());
    if (result.code) {
      console.log("Generating ReduxInspector.min.js");
      fs.writeFileSync("out/ReduxInspector.min.js", result.code, "utf8");
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
