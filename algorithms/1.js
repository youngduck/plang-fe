/*
    # **문제 1 — 유효한 괄호 문자열**

    ## **문제 설명**

    문자열 s가 주어질 때,

    괄호가 올바르게 짝지어져 있는지 판별하는 함수를 작성하세요.

    문자열에는 다음 문자만 포함됩니다:

    ```
    ( ) { } [ ]
    ```

    괄호는 다음 규칙을 만족해야 합니다:

    1. 여는 괄호는 같은 종류의 닫는 괄호로 닫혀야 합니다.
    2. 여는 괄호는 올바른 순서로 닫혀야 합니다.

*/

/*
    문제 풀이 방식 설명
    1. 스택을 사용하면 문제를 쉽게 해결할 수 있을거라 생각하여 스택을 사용하여 문제를 해결했습니다.
    2. bracketMap을 사용하여 여는 괄호와 닫는 괄호를 매핑하여 문제를 해결했습니다.

*/
function solution(s) {

    const stack = [];
    const bracketMap = {
        '(': ')',
        '{': '}',
        '[': ']'
    };

    for (const char of s) {
        if (bracketMap[char]) {
            stack.push(char);
        } else {
            const last = stack.pop();
            if (bracketMap[last] !== char) {
                return false;
            }
        }
    }

    return stack.length === 0;
}


console.log(solution("()"))        // true
console.log(solution("()[]{}"))    // true
console.log(solution("(]"))        // false
console.log(solution("([)]"))      // false
console.log(solution("{[]}"))      // true