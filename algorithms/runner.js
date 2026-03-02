// 간단한 러너: pnpm run dev -- 1 처럼 번호를 넘기면 해당 파일을 실행합니다.
// 예) pnpm run dev -- 1  ->  ./1.js 실행

const targetNumber = process.argv[2];

if (!targetNumber) {
  console.log("사용법: pnpm run dev -- <번호>");
  console.log("예: pnpm run dev -- 1  (1.js 실행)");
  process.exit(1);
}

const targetPath = `./${targetNumber}.js`;

// require 시 에러가 나면 보기 쉽게 메시지를 출력합니다.
try {
  // eslint-disable-next-line import/no-dynamic-require, global-require
  require(targetPath);
} catch (error) {
  console.error(`실행할 파일을 찾지 못했거나 에러가 발생했습니다: ${targetPath}`);
  console.error(error);
  process.exit(1);
}

