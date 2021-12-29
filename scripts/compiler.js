// noinspection JSUnresolvedVariable

let debug_compiler = false;
let lang = "tr_TR";
let NAME = "";

(async () => {
    function _eval(r) {
        return eval(r);
    }

    class CompilerError extends Error {
    }

    const string_reg = /\d|\w|\u0131|\u015f|\u011f|\u00fc|\u00f6|\u00e7|\_/;
    const langs = {
        en_US: {
            "Line": "Line",
            "ended": "Program ended",
            "stopped": "Program stopped",
            "invalid-type": "Invalid type",
            "not-defined-variable": "Variable '%0' haven't defined",
            "print": "print",
            "wait": "wait",
            "wait-number": "Wait function should include number argument",
            "wait-ms": "wait_ms",
            "stop": "stop",
            "else": "else",
            "if": "if",
            "no-statement": "There is no statement to be closed",
            "line-start": "Line should not start with '%0'",
            "start-string": "Line should not start with a string",
            "statement-not-if": "Closed statement wasn't if statement",
            "close-string": "String statement haven't closed",
            "eval": "eval",
            "eval-arg": "Eval function should include argument",
            "symbol-end": "There is symbol that hasn't been finished",
            "start-int": "Line cannot start with number",
            "cant-add-func": "Cannot execute math with function variable",
            "const-var": "Cannot reassign constant variable",
            "empty-statement": "Statement should not be empty",
            "random": "random",
            "pow": "pow",
            "floor": "floor",
            "sqrt": "sqrt",
            "abs": "abs",
            "nan-error": "An error occurred while executing math function",
            "variable-error": "Wrong usage of variables/functions",
            "repeat": "repeat",
            "repeat_wait": "repeat_wait",
            "repeat_always": "repeat_always",
            "repeat_times": "repeat_times",
            "repeat_times_wait": "repeat_times_wait",
            "cannot-wait-func": "Cannot use wait functions in functions",
            "clear": "clear",
            "arguments-number": "Arguments should be number",
            "true": "true",
            "false": "false",
            "no-set": "Invalid __set__ argument",
            "data-set": "data_set",
            "data-set-first": "First argument of data_set should be type of string",
            "data-set-second": "Second argument of data_set should not be empty",
            "data-get": "data_get",
            "data-get-error": "First argument of data_get should be type of string",
            "data-remove": "data_remove",
            "data-remove-error": "First argument of data_remove should be type of string"
        },
        tr_TR: {
            "Line": "Sat\u0131r",
            "ended": "Program sona erdi",
            "stopped": "Program durduruldu",
            "invalid-type": "Ge\u00e7ersiz t\u00fcr",
            "not-defined-variable": "'%0' de\u011fi\u015fkeni tan\u0131mlanmad\u0131",
            "print": "yazd\u0131r",
            "wait": "bekle",
            "wait-number": "Bekle fonksiyonu say\u0131 arg\u00fcman\u0131 i\u00e7ermeli",
            "wait-ms": "bekle_ms",
            "stop": "durdur",
            "else": "de\u011filse",
            "if": "e\u011fer",
            "no-statement": "Kapat\u0131lacak bir ifade yok",
            "line-start": "Sat\u0131r '%0' ile ba\u015flamamal\u0131",
            "start-string": "Sat\u0131r yaz\u0131 t\u00fcr\u00fc ile ba\u015flamamal\u0131",
            "statement-not-if": "Kapat\u0131lan ifade e\u011fer ifadesi de\u011fildi",
            "close-string": "Yaz\u0131 ifadesi kapat\u0131lmad\u0131",
            "eval": "eval",
            "eval-arg": "Eval fonksiyonu arg\u00fcman i\u00e7ermeli",
            "symbol-end": "Bitirilmemi\u015f bir sembol var",
            "start-int": "Sat\u0131r say\u0131 ile ba\u015flamamal\u0131",
            "cant-add-func": "Fonksiyon de\u011ferli de\u011fi\u015fkeninde matematik i\u015flemi yap\u0131lamaz",
            "const-var": "Sabit de\u011fi\u015fken de\u011fi\u015fken de\u011fi\u015ftirilemez",
            "empty-statement": "E\u011fer ifadesi bo\u015f olmamalı",
            "random": "rastgele",
            "pow": "üs",
            "floor": "taban",
            "sqrt": "karek\u00f6k",
            "abs": "mutlak",
            "nan-error": "Matematik fonksiyonu \u00e7alı\u015ftırılırken bir hata olu\u015ftu",
            "variable-error": "Fonksiyon/deği\u015fkenlerin yanl\u0131\u015f kullan\u0131m\u0131",
            "repeat": "tekrarla",
            "repeat_wait": "tekrarla_bekle",
            "repeat_always": "s\u00fcrekli_tekrarla",
            "repeat_times": "kere_tekrarla",
            "repeat_times_wait": "kere_tekrarla_bekle",
            "cannot-wait-func": "Bekle fonksiyonlar\u0131 fonksiyonlar\u0131n\u0131n i\u00e7inde kullan\u0131lamaz",
            "clear": "temizle",
            "arguments-number": "Arg\u00fcmanlar say\u0131 olmal\u0131",
            "true": "do\u011fru",
            "false": "yanl\u0131\u015f",
            "no-set": "Ge\u00e7ersiz __set__ arg\u00fcman\u0131",
            "data-set": "veri_ayarla",
            "data-set-first": "Veri_ayarla fonksiyonunun ilk arg\u00fcman\u0131 yaz\u0131 tipinde olmal\u0131",
            "data-set-second": "Veri_ayarla fonksiyonunun ikinci arg\u00fcman\u0131 bo\u015f olmamal\u0131",
            "data-get": "veri_al",
            "data-get-error": "Veri_al fonksiyonunun ilk arg\u00fcman\u0131 yaz\u0131 tipinde olmal\u0131",
            "data-remove": "veri_sil",
            "data-remove-error": "Veri_sil fonksiyonunun ilk arg\u00fcman\u0131 yaz\u0131 tipinde olmal\u0131"
        }
    };

    // noinspection NonAsciiCharacters, JSUnusedLocalSymbols
    const ALLOWING_LETTERS = {
        "ı": "\u0131",
        "ş": "\u015f",
        "ğ": "\u011f",
        "ü": "\u00fc",
        "ö": "\u00f6",
        "ç": "\u00e7"
    };

    /**
     * DONE: print - yazdır
     * DONE: if - eğer
     * DONE: else - değilse
     * DONE: elseif - eğer değilse
     * DONE: basic compiler (number, string, variable, function, +, -, *, /)
     * DONE: multiple parameters to functions
     * DONE: add math funcs
     * DONE: normal variables - NAME = VAR
     * DONE: constant variables - *NAME = VAR;
     * DONE: += -= *= /=
     * DONE: ++ --
     * DONE: repeat(STATEMENT) - Doesn't freeze and repeats until its statement gets false
     * DONE: repeat_wait(STATEMENT) - Freezes line and repeats until its statement gets false
     * DONE: repeat_always {} - Repeats always
     * DONE: repeat_times(TIMES) - Repeats line TIMES times
     * DONE: repeat_times_wait(TIMES) - Freezes line and repeats line TIMES times
     * TODO: Object api: .PROPERTY .FUNCTION() .PROP.PROP.PROP.PROP().PROP
     * TODO: Index api: ARRAY[INDEX]
     * TODO: Array(...DEFAULT_VARIABLES)
     * TODO: Array .add(VAR) .remove(VAR) .delete(INDEX) .set(INDEX, VAR) .get(INDEX)
     * TODO: Map - .get(INDEX) .set(INDEX, VAR) .delete(INDEX)
     * TODO: Array .add .remove .set .get
     * TODO: function NAME(...VARIABLE_NAMES)
     * TODO: return VARIABLE - for function
     * DONE: stop()
     * DONE: wait(seconds)
     * DONE: wait_ms(MILLISECONDS)
     * DONE: eval(STRING)
     * TODO: add data functions
     * DONE: throw error when creates a variable named some of these
     * DONE: comments
     *
     * TODO: switch case default break - *Not really necessary*
     */

    class Type {
        constructor(a) {
            this.a = a;
        }

        /*** @returns {any} */
        string(args, compiler) {
            throw new CompilerError(langs[lang]["invalid-type"]);
        }

        clone() {
            throw new Error();
            // noinspection UnreachableCodeJS
            return null;
        }
    }

    class _Raw extends Type {
        string() {
            return this.a;
        }

        clone() {
            return new _Raw(this.a);
        }
    }

    class _String extends Type {
        string() {
            return JSON.stringify(this.a);
        }

        clone() {
            return new _String(this.a);
        }
    }

    class _Number extends Type {
        string() {
            return this.a;
        }

        clone() {
            return new _Number(this.a);
        }
    }

    class _Callable extends Type {
        constructor(a, b) {
            super(a);
            this.args = b;
        }

        getName() {
            return this.name;
        }

        /**
         * @param {string} code
         * @param {Compiler} compiler
         */
        set_callback_from_code(code, compiler) {
            const alg = (new Compiler(code.split("\n"))).line_alg;
            this.run = () => compiler.compile_alg(alg, compiler);
        }

        string(args, compiler) {
            const result = this.run(args || this.args, compiler);
            if (result instanceof Promise) return result;
            return result.string(null, compiler);
        }

        /**
         * @param {string[]} args
         * @param {Compiler} compiler
         * @returns {Type}
         */
        run(args, compiler) {

        }

        clone() {
            const callable = new _Callable(this.a, this.args);
            callable.getName = this.getName;
            callable.set_callback_from_code = this.set_callback_from_code;
            callable.string = this.string;
            callable.run = this.run;
            return callable;
        }
    }

    class _Null extends Type {
        constructor() {
            super();
        }

        string() {
            return "";
        }

        clone() {
            return new _Null();
        }
    }

    const _err = (err, compiler) => {
        compiler.emit("on_error", err);
        compiler.emit("on_end");
        compiler.working = false;
        throw new CompilerError(err);
    };

    class _Variable extends Type {
        constructor(a, b) {
            super(a);
            this.args = b;
        }

        string(args, compiler) {
            const c = DEFAULT_FUNCTIONS.find(i => i.prototype.getName() === this.a);
            let a = compiler.get_variable(this.a) || c.string(c.args, compiler);
            if (!a) return _err(langs[lang]["not-defined-variable"].replace("%0", this.a), compiler);
            if (a instanceof _Callable || a.prototype instanceof _Callable) a = a.string(args, compiler);
            return a;
        }

        clone() {
            return new _Variable(this.a, this.args);
        }
    }

    /**
     * @description Splits commas to un-compiled raw texts
     * @param {string} str
     * @return {string[]}
     */
    function split_function_parameters(str) {
        let str_stat = null; // ""''
        let obj_stat = {
            "(": 0,
            ")": 0,
            "[": 0,
            "]": 0,
            "{": 0,
            "}": 0
        };
        let add = "";
        let list = [];
        for (let i = 0; i < str.length; i++) {
            let m = str[i];
            add += m;
            if (str_stat && m === str_stat) {
                str_stat = null;
            } else if (!str_stat && (m === `"` || m === `'`)) {
                str_stat = m;
            }
            if (!str_stat) {
                if (Object.keys(obj_stat).map(i => i.toString()).includes(m)) {
                    obj_stat[m]++;
                } else {
                    if (m === "," && obj_stat["("] === obj_stat[")"] && obj_stat["["] === obj_stat["]"] && obj_stat["{"] === obj_stat["}"]) {
                        if (add.endsWith(",")) add = add.split("").slice(0, add.length - 1).join("");
                        list.push(add);
                        add = "";
                    }
                }
            }
        }
        if (add) list.push(add);
        return list;
    }

    /**
     * @param {function(): string} name
     * @param {function(args: string[], compiler: Compiler): Type} run
     * @returns {Type | function}
     */
    function generate_function(name, run) {
        class Func extends _Callable {
            getName() {
                return name();
            }

            run(args, compiler) {
                return run(args, compiler);
            }
        }

        return Func;
    }

    const generate_math_function = (name, raw) => generate_function(raw || (() => name), (args) => {
        const res = Math[name](...(args.map(i => _eval(i))));
        if (isNaN(res)) return _err(langs[lang]["nan-error"], compiler);
        return new _Number(res);
    });

    const __set__ = generate_function(() => "__set__", (args, compiler) => {
        args = compiler.sets[args[0] * 1];
        if (!args) return _err(langs[lang]["no-set"], compiler);
        const name = args[0];
        let setting = args[1];
        const old_var = compiler.get_variable(name);
        if ((compiler.variables[name] && compiler.variables[name].constant) || DEFAULT_FUNCTIONS.find(i => i.prototype.getName() === name)) return _err(langs[lang]["const-var"], compiler);
        const _c = () => {
            return _err(langs[lang]["not-defined-variable"].replace("%0", name), compiler);
        };
        const is_constant = args[2] === "true";
        if (args[3] !== "=") {
            if (!old_var) _c();
            setting = "(" + old_var + ")" + args[3] + "(" + setting + ")";
        }
        setting = compile_auto(setting, compiler);
        compiler.set_variable(name, setting.map(i => i instanceof _Callable ? i.run(i.args, compiler) : i).map(i => i.string(i.args, compiler)).join(""), is_constant);
        return new _Null();
    });
    setTimeout(() => {
        document._data_manager = {
            data: JSON.parse(localStorage.getItem("_data_" + PROJECT_NAME) || "{}"),
            set(data, value) {
                document._data_manager.data[data] = value;
                document._data_manager.save();
            },
            get(data) {
                return document._data_manager.data[data];
            },
            remove(data) {
                delete document._data_manager.data[data];
                document._data_manager.save();
            },
            save() {
                localStorage.setItem("_data_" + PROJECT_NAME, JSON.stringify(document._data_manager.data));
            }
        };
    }, 150);

    const DEFAULT_FUNCTIONS = [
        __set__,
        generate_function(() => langs[lang]["clear"], (_, compiler) => {
            compiler.emit("on_clear");
            return new _Null();
        }),
        generate_function(() => langs[lang]["random"], (args) => {
            args = args.slice(0, 2).map(i => _eval(i) * 1);
            if (args.some(i => isNaN(i * 1)) || args.length !== 2) return _err(langs[lang]["nan-error"], compiler);
            const min = args[0] > args[1] ? args[1] : args[0];
            const max = args[0] > args[1] ? args[0] : args[1];
            return new _Number(Math.floor(Math.random() * (max - min + 1)) + min);
        }),
        generate_function(() => "csc", (args) => {
            args = _eval(args[0]) * 1;
            if (isNaN(args)) return _err(langs[lang]["nan-error"], compiler);
            return new _Number(1 / Math.sin(args));
        }),
        generate_function(() => "sec", (args) => {
            args = _eval(args[0]) * 1;
            if (isNaN(args)) return _err(langs[lang]["nan-error"], compiler);
            return new _Number(1 / Math.cos(args));
        }),
        generate_function(() => "cot", (args) => {""
            args = _eval(args[0]) * 1;
            if (isNaN(args)) return _err(langs[lang]["nan-error"], compiler);
            return new _Number(1 / Math.tan(args));
        }),
        generate_function(() => langs[lang]["print"], (args, compiler) => {
            args.forEach(i => compiler.emit("on_print", _eval(i)));
            return new _Null();
        }),
        generate_function(() => langs[lang]["wait"], (args) => {
            if (!args[0] * 1) return _err(langs[lang]["wait-number"], compiler);
            return new Promise((a) => setTimeout(() => a(new _Null()), args[0] * 1 * 1000));
        }),
        generate_function(() => langs[lang]["wait-ms"], (args) => {
            if (!args[0] * 1) return _err(langs[lang]["wait-number"], compiler);
            return new Promise((a) => setTimeout(() => a(new _Null()), args[0] * 1));
        }),
        generate_function(() => langs[lang]["stop"], (args, compiler) => {
            compiler.working = false;
            compiler.emit("on_stop");
            return new _Null();
        }),
        generate_function(() => langs[lang]["eval"], (args, compiler) => {
            if (!args[0]) return _err(langs[lang]["eval-arg"], compiler);
            compile_lines(args.map(i => _eval(i)), () => {
            }, compiler);
            return new _Null();
        }),
        generate_function(() => langs[lang]["data-set"], (args, compiler) => {
            args = args.map(i=> _eval(i));
            if(typeof args[0] !== "string") return _err(langs[lang]["data-set-first"], compiler);
            if(args[1] == null) return _err(langs[lang]["data-set-second"], compiler);
            document._data_manager.set(args[0], args[1]);
            return new _Null();
        }),
        generate_function(() => langs[lang]["data-get"], (args, compiler) => {
            args = args.map(i=> _eval(i));
            if(typeof args[0] !== "string") return _err(langs[lang]["data-get-error"], compiler);
            let dat = document._data_manager.get(args[0]);
            if(dat == null) return new _Null();
            switch(typeof dat) {
                case "string":
                    return new _String(dat);
                case "number":
                    return new _Number(dat);
                default:
                    return new _Null();
            }
        }),
        generate_function(() => langs[lang]["data-remove"], (args, compiler) => {
            args = args.map(i=> _eval(i));
            if(typeof args[0] !== "string") return _err(langs[lang]["data-remove-error"], compiler);
            document._data_manager.remove(args[0]);
            return new _Null();
        })
    ];

    const additions = ["pow", "floor", "sqrt", "abs"];
    /*** @type {{name: string, value: string}[]} */
    const initial_variables = [
        {name: langs[lang]["true"], value: "1"},
        {name: langs[lang]["false"], value: "0"},
        {name: "null", value: "0"}
    ];
    ["E", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"].forEach(i => initial_variables.push({
        name: i,
        value: Math[i].toString()
    }))

    const other_math = [
        "cos", "exp", "acos", "acosh", "asin", "asinh", "log", "atan", "atan2", "atanh", "cbrt",
        "ceil", "max", "min", "cosh", "clz32", "expm1", "fround", "hypot", "imul", "log2", "log1p",
        "log10", "round", "sign", "sin", "sinh", "tan", "tanh", "trunc"
    ];

    additions.forEach(i => DEFAULT_FUNCTIONS.push(generate_math_function(i, () => langs[lang][i])));
    other_math.forEach(i => DEFAULT_FUNCTIONS.push(generate_math_function(i)));
    document.defaults = {functions: DEFAULT_FUNCTIONS.map(i=> {
        return {name: i.prototype.getName()};
    }), variables: initial_variables, statements: ["if", "else", "repeat", "repeat_wait", "repeat_times", "repeat_times_wait", "repeat_always"].map(i=> {return {name: langs[lang][i]}})};

    /**
     * @param {string} str
     * @param {Compiler} compiler
     * @returns {_Callable}
     */
    function compile_function_type(str, compiler) {
        str = clear_spaces(str);
        let name = "";
        let a = false;
        for (let i = 0; i < str.length; i++) {
            if (!a) {
                if (str[i] === "(") a = true;
                else {
                    name += str[i];
                }
            }
        }
        let b = str.split("").slice(name.length + 1, str.length - 1).join("");
        let d = b.split("").slice(0, b.length).join("");
        let e = split_function_parameters(d).map(i => clear_spaces(i));
        const f = DEFAULT_FUNCTIONS.find(i => i.prototype.getName() === name);
        let g = compiler.get_variable(name) || f;
        if (!g || (!(g instanceof _Callable) && !(g.prototype instanceof _Callable))) return _err(langs[lang]["not-defined-variable"].replace("%0", name), compiler);
        const func_args = e.map(j => compile_auto(j, compiler).map(i => {
            const st = i.string(i.args, compiler);
            if (st instanceof Promise) return _err(langs[lang]["cannot-wait-func"], compiler);
            return st;
        }).join(""));
        if (g.prototype instanceof _Callable) g = new g(name, func_args);
        g.args = func_args;
        return g;
    }

    function is_string(str) {
        return (str.startsWith(`"`) && str.endsWith(`"`) && str.split("").filter(i => i === `"`).length === 2) || (str.startsWith(`'`) && str.endsWith(`'`) && str.split("").filter(i => i === `'`).length === 2) ? str.split("").slice(1, str.length - 1).join("") : false;
    }

    function clear_spaces(str) {
        if (str[0] !== " " && str[str.length - 1] !== " ") return str;
        let a = false;
        for (let i = 0; i < str.length; i++) {
            if (!a && str[i] !== " ") {
                a = true;
                str = str.split("").slice(i).join("");
            }
        }
        a = false;
        for (let i = str.length - 1; i >= 0; i--) {
            if (!a && str[i] !== " ") {
                a = true;
                str = str.split("").slice(0, i + 1).join("");
            }
        }
        return str;
    }

    const symbols = [..."+-*/%()<>", "==", "!=", "<=", "=>", "=<", ">=", "!", "&&", "||", "?", ":"];

    /**
     * @param {string} string
     * @param {Compiler} compiler
     * @returns {Type[]}
     */
    function compile_auto(string, compiler) {
        let str_stat = null;
        let obj_stat = {
            "(": 0,
            ")": 0,
            "[": 0,
            "]": 0,
            "{": 0,
            "}": 0
        };
        let comment = 0;
        let add = "";
        let symbol_current = false;
        let in_func = false;
        let func_end = null;
        let var_wait = null;
        /*** @type {Type[]} */
        let res = [];
        for (let index = 0; index < string.length; index++) {
            const currentLetter = string[index];
            add += currentLetter;
            const clean = clear_spaces(add);
            if (!clean) continue;
            if (currentLetter === "/") {
                comment++;
            } else comment = 0;
            if (comment >= 2) break;
            if (str_stat) {
                if (str_stat === currentLetter) {
                    str_stat = null;
                    res.push(new _String(add.split("").slice(1, add.length - 1).join("")));
                    add = "";
                }
                continue;
            }
            if (Object.keys(obj_stat).map(i => i.toString()).includes(currentLetter)) {
                obj_stat[currentLetter]++;
            }
            if (var_wait !== null) {
                if (var_wait > index) continue;
                res.push(new _Variable(clean));
                var_wait = null;
                add = "";
                continue;
            }
            if (in_func) {
                if (func_end > index) continue;
                res.push(compile_function_type(clean, compiler));
                in_func = false;
                add = "";
                continue;
            }
            if (clean[0] === `"` || clean[0] === `'`) {
                str_stat = clean[0];
                continue;
            }
            if (symbols.includes(clean) && !symbols.includes(clean + string[index + 1])) {
                res.push(new _Raw(clean));
                symbol_current = false;
                add = "";
                continue;
            }
            if (symbols.some(i => i.startsWith(clean))) {
                symbol_current = clean;
                continue;
            }
            if (!clean.replace(/ /g, "").split("").some(i => ![..."1234567890."].includes(i))) {
                if (clean.replace(/ /g, "").length > 0) res.push(new _Number(clean.replace(/ /g, "")));
                add = "";
                continue;
            }
            if (!string_reg.test(currentLetter)) {
                res.push(new _Raw(currentLetter));
                add = "";
                continue;
            }
            let func_check = false;
            let func_end_check = null;
            let indexVar = null;
            let can_be_var = true;
            let str_stat_a = null;
            let obj_stat_a = {
                "(": 0,
                ")": 0,
                "[": 0,
                "]": 0,
                "{": 0,
                "}": 0
            };
            for (let j = index - clean.length + 1; j < string.length; j++) {
                let h = string[j];
                if (Object.keys(obj_stat_a).includes(h)) can_be_var = false;
                const obj = () => obj_stat_a["("] === obj_stat_a[")"] && obj_stat_a["["] === obj_stat_a["]"] && obj_stat_a["{"] === obj_stat_a["}"];
                if (str_stat_a === null) {
                    if (h === `"` || h === `'`) {
                        str_stat_a = h;
                        continue;
                    }
                    if (Object.keys(obj_stat_a).map(i => i.toString()).includes(h)) {
                        obj_stat_a[h]++;
                    }
                    if (func_check) {
                        if (obj() && h === ")") {
                            func_end_check = j;
                            break;
                        }
                    } else {
                        if (h === ")") {
                            can_be_var = true;
                            indexVar = j - 1;
                            break;
                        }
                        if (h === "(") {
                            can_be_var = false;
                            func_check = true;
                            continue;
                        }
                        if (h === " ") {
                            can_be_var = true;
                            indexVar = j;
                            break;
                        }
                        if (!string_reg.test(h)) {
                            indexVar = j - 1;
                            break;
                        }
                    }
                } else {
                    if (h === str_stat_a) str_stat_a = null;
                }
            }
            if (func_check && func_end_check) {
                in_func = true;
                func_end = func_end_check;
            } else if (can_be_var) {
                var_wait = indexVar * 1;
                if (indexVar === null) {
                    let cl = clear_spaces(string.split("").slice(index).join(""));
                    res.push(new _Variable(cl));
                    break;
                } else if (var_wait === index) {
                    res.push(new _Variable(currentLetter));
                    add = "";
                    var_wait = null;
                }
            } else return _err(langs[lang]["variable-error"], compiler);
        }
        if (obj_stat["("] !== obj_stat[")"] || obj_stat["["] !== obj_stat["]"] || obj_stat["{"] !== obj_stat["}"] || symbol_current) return _err(langs[lang]["symbol-end"], compiler);
        if (debug_compiler) console.info(res);
        return res;
    }

    const compile_line = async (line, next, compiler) => {
        if (line instanceof Line) return line.run(next, compiler);
        let str_stat = null;
        for (let i = 0; i < line.length; i++) {
            let m = line[i];
            if (str_stat && m === str_stat) {
                str_stat = null;
            } else if (!str_stat && (m === `"` || m === `'`)) {
                str_stat = m;
            }
        }
        if (str_stat) return _err(langs[lang]["close-string"], compiler);
        const actions = compile_auto(line, compiler);
        for (let i = 0; i < actions.length; i++) {
            const res = actions[i].string(null, compiler);
            if (res instanceof Promise) await res;
        }
        if (!compiler.working && !val) return;
        next();
    }

    function compile_lines(lines, next, compiler) {
        let index = -1;
        const cmp = (val = false) => {
            index++;
            if (lines.length <= index) return next();
            if(val) compiler.working = true;
            compile_line(lines[index], cmp, compiler);
        }
        cmp();
    }

    class Line {
        constructor(line) {
            this.line = line;
        }

        run(next, compiler, val) {
            compile_line(this.line, next, compiler, val);
        }
    }

    class MultipleLines extends Line {
        /*** @param {Line[]} lines */
        constructor(lines) {
            super(null);
            /*** @type {Line[]} */
            this.lines = lines;
            this.closed = false;
        }

        get_last_multiple_line() {
            const f = this.lines.filter(i => i instanceof MultipleLines && !i.closed);
            const l = f[f.length - 1];
            if (l instanceof MultipleLines) return l.get_last_multiple_line();
            return this;
        }

        close() {
            const f = this.lines.filter(i => i instanceof MultipleLines && !i.closed);
            const l = f[f.length - 1];
            if (l instanceof MultipleLines) return l.close();
            this.closed = true;
        }

        add_line(line) {
            const f = this.lines.filter(i => i instanceof MultipleLines && !i.closed);
            const l = f[f.length - 1];
            if (l instanceof MultipleLines) return l.add_line(line);
            this.lines.push(line);
        }

        run(next, compiler, val) {
            compile_lines(this.lines, next, compiler, val);
        }
    }

    class IfLine extends MultipleLines {
        /**
         * @param {string} statement
         * @param {Line[]} lines
         */
        constructor(statement, lines) {
            super(lines);
            this.statement = statement;
            this.originalStatement = statement;
        }

        getLastStatements() {
            const list = [];
            let r = this.last;
            while (r instanceof IfLine || r instanceof ElseIfLine) {
                list.push(r);
                if (r instanceof ElseIfLine) r = r.last;
                else break;
            }
            return list;
        }

        run(next, compiler, val) {
            let statement = compile_auto(this.statement, compiler).map(i => i.string(null, compiler)).join("");
            if (_eval(statement)) super.run(next, compiler, val);
            else next();
        }
    }

    class ElseLine extends IfLine {
    }

    class ElseIfLine extends ElseLine {
    }

    let _loop_runtime_id = 0;

    class RepeatLine extends MultipleLines {
        constructor(lines, statement) {
            super(lines);
            this.statement = statement;
        }

        run(next, compiler) {
            const runtime_id = _loop_runtime_id++;
            compiler.add_loop(this, runtime_id);
            const statement = () => compile_auto(this.statement, compiler).map(i => i.string(null, compiler)).join("");
            const run = () => {
                if (_eval(statement())) {
                    super.run(() => setTimeout(() => run(), 1), compiler);
                } else {
                    compiler.delete_loop(this, runtime_id);
                }
            }
            run();
            next();
        }
    }

    class RepeatWaitLine extends MultipleLines {
        constructor(lines, statement) {
            super(lines);
            this.statement = statement;
        }

        run(next, compiler) {
            const runtime_id = _loop_runtime_id++;
            compiler.add_loop(this, runtime_id);
            const statement = () => compile_auto(this.statement, compiler).map(i => i.string(null, compiler)).join("");
            const run = () => {
                if (_eval(statement())) {
                    super.run(() => setTimeout(() => run(), 1), compiler);
                } else {
                    compiler.delete_loop(this, runtime_id, true);
                    next(true);
                }
            }
            run();
        }
    }

    class RepeatAlwaysLine extends RepeatLine {
        constructor(lines) {
            super(lines, "1");
        }
    }

    class RepeatTimesLine extends MultipleLines {
        constructor(lines, times_raw) {
            super(lines);
            this.times_raw = times_raw;
        }

        run(next, compiler) {
            const runtime_id = _loop_runtime_id++;
            let times = 0;
            compiler.add_loop(this, runtime_id);
            const run = () => {
                if (times++ < this.times_raw) {
                    super.run(() => setTimeout(() => run(), 1), compiler);
                } else {
                    compiler.delete_loop(this, runtime_id);
                }
            }
            run();
            next();
        }
    }

    class RepeatTimesWaitLine extends MultipleLines {
        constructor(lines, times_raw) {
            super(lines);
            this.times_raw = times_raw;
        }

        run(next, compiler) {
            const runtime_id = _loop_runtime_id++;
            let times = 0;
            compiler.add_loop(this, runtime_id);
            const run = () => {
                if (times++ < this.times_raw) {
                    super.run(() => setTimeout(() => run(), 1), compiler);
                } else {
                    compiler.delete_loop(this, runtime_id, true);
                    next(true);
                }
            }
            run();
        }
    }

    document._compilers = {};
    let __uuid = 0;
    let _set_id = 0;

    class Compiler {
        /*** @param {string[]} lines */
        constructor(lines) {
            this.uuid = __uuid++;
            document._compilers[this.uuid] = this;
            /*** @type {Object<any, {constant: boolean, value: string | Type}>}} */
            this.variables = {};
            this.sets = {};
            initial_variables.forEach(i => this.variables[i.name] = {constant: true, value: i.value})
            /*** @type {Line[]} */
            this.line_alg = [];
            this.start(lines);
            this.working = true;
            this.loops = {};
            this.end_func = () => {
            };
            this.events = {
                "on": {
                    "on_print": [],
                    "on_stop": [],
                    "on_end": [],
                    "on_error": [],
                    "on_clear": []
                },
                "once": {
                    "on_print": [],
                    "on_stop": [],
                    "on_end": [],
                    "on_error": [],
                    "on_clear": []
                }
            };
        }

        add_loop(line, runtime_id) {
            this.loops[runtime_id] = line;
        }

        delete_loop(line, runtime_id, val) {
            delete this.loops[runtime_id];
            if (Object.keys(this.loops).length === 0 && this.working && !val) {
                this.working = false;
                this.end_func();
            }
        }

        /**
         * @param v
         * @return {string|_Callable|null}
         */
        get_variable(v) {
            return this.variables[v] ? (this.variables[v].value instanceof Type ? this.variables[v].value.string(this.variables[v].value.args, this) : this.variables[v].value) : null;
        }

        /**
         * @param {string} v
         * @param {string} a
         * @param {boolean?} c
         */
        set_variable(v, a, c = false) {
            this.variables[v] = {constant: c, value: a};
        }

        get_last_multiple_line() {
            const f = this.line_alg.filter(i => i instanceof MultipleLines && !i.closed);
            const l = f[f.length - 1];
            if (l instanceof MultipleLines) return l.get_last_multiple_line();
            return null;
        }

        /**
         * @param {Line} line
         * @return {*}
         */
        add_line(line) {
            const f = this.line_alg.filter(i => i instanceof MultipleLines && !i.closed);
            const l = f[f.length - 1];
            if (l instanceof MultipleLines) return l.add_line(line);
            this.line_alg.push(line);
        }

        start(lines) {
            lines.forEach((line, i) => {
                try {
                    line = clear_spaces(line);
                    if (!line) return;
                    const emt = line.split("").filter(i => i !== " ").join("");
                    if (!emt) return;
                    if (/\d/.test(line[0])) return _err(langs[lang]["start-int"], compiler);
                    if (!/\w|\}|\*/.test(line[0]) && !line.startsWith("//")) return _err(langs[lang]["line-start"].replace("%0", line[0]), compiler);
                    if (is_string(line)) return _err(langs[lang]["start-string"], compiler);
                    let emp = line;
                    while (emp.includes("  ")) emp = emp.replace(/ {2}/g, " ");
                    const empArr = emp.split(" ");
                    if (emt === "}") {
                        const last = this.get_last_multiple_line();
                        if (!last) return _err(langs[lang]["no-statement"], compiler);
                        return last.close();
                    }
                    if (empArr[0] === "}" && empArr[1] === langs[lang]["else"] && empArr[2] === "{") {
                        const last = this.get_last_multiple_line();
                        if (!last) return _err(langs[lang]["no-statement"], compiler);
                        if (last instanceof ElseLine && !(last instanceof ElseIfLine)) return _err(langs[lang]["statement-not-if"], compiler);
                        last.close();
                        const elseLine = new ElseLine(`!(${last.statement})`, []);
                        const lastOnes = last.getLastStatements().map(i => `!(${i.originalStatement})`).join("&&");
                        elseLine.statement = `${lastOnes ? lastOnes + "&&" : ""}!(${last.statement})`;
                        return this.add_line(elseLine);
                    }
                    if (empArr[0] === "}" && empArr[1] === langs[lang]["else"] && empArr[2].startsWith(langs[lang]["if"] + "(") && emt.endsWith("){")) {
                        const last = this.get_last_multiple_line();
                        if (!last) return _err(langs[lang]["no-statement"], compiler);
                        if (!(last instanceof IfLine)) return _err(langs[lang]["statement-not-if"], compiler);
                        let s = "}" + langs[lang]["else"] + langs[lang]["if"] + "(";
                        let a = 0;
                        let b;
                        for (let j = 0; j < line.length; j++) {
                            if (s[a] === line[j]) {
                                a++;
                                if (a === s.length) {
                                    b = j + 1;
                                    break;
                                }
                            }
                        }
                        let c = 2;
                        let d = line.split("").slice(b).join("");
                        let e;
                        for (let j = d.length - 1; j > -1; j--) {
                            if (d[j] === ")" || d[j] === "{") c--;
                            if (c === 0) {
                                e = j;
                                break;
                            }
                        }
                        let f = d.split("").slice(0, e).join("");
                        last.close();
                        const eiLine = new ElseIfLine("", []);
                        eiLine.last = last;
                        eiLine.originalStatement = f;
                        const lastOnes = eiLine.getLastStatements().map(i => `!(${i.originalStatement})`).join("&&");
                        if (!lastOnes.replace(/ /g, "")) return _err(langs[lang]["empty-statement"], compiler);
                        eiLine.statement = `${lastOnes} && (${f})`;
                        return this.add_line(eiLine);
                    }
                    /*** @type {{arg: function(string): any[], name: string, class: function | MultipleLines}[]} */
                    const general_statement_types = [
                        {
                            name: langs[lang]["if"],
                            class: IfLine,
                            arg: statement => [statement, []]
                        },
                        {
                            name: langs[lang]["repeat"],
                            class: RepeatLine,
                            arg: statement => [[], statement]
                        },
                        {
                            name: langs[lang]["repeat_wait"],
                            class: RepeatWaitLine,
                            arg: statement => [[], statement]
                        },
                        {
                            name: langs[lang]["repeat_times"],
                            class: RepeatTimesLine,
                            arg: statement => [[], statement]
                        },
                        {
                            name: langs[lang]["repeat_times_wait"],
                            class: RepeatTimesWaitLine,
                            arg: statement => [[], statement]
                        }
                    ];
                    if (emt.startsWith(langs[lang]["repeat_always"] + "{")) {
                        return this.add_line(new RepeatAlwaysLine([], ""));
                    }
                    for (let n = 0; n < general_statement_types.length; n++) {
                        const ty = general_statement_types[n];
                        if (line.startsWith(ty.name + "(") && emt.endsWith("){")) {
                            let a = 2;
                            let b = line.split("").slice(ty.name.length + 1).join("");
                            let c;
                            for (let j = b.length - 1; j > -1; j--) {
                                if (b[j] === ")" || b[j] === "{") a--;
                                if (a === 0) {
                                    c = j + 1;
                                    break;
                                }
                            }
                            let d = b.split("").slice(0, c - 1).join("");
                            if (!d.replace(/ /g, "")) return _err(langs[lang]["empty-statement"], compiler);
                            return this.add_line(new ty.class(...ty.arg(d)));
                        }
                    }
                    let var_check = false;
                    let name_var = "";
                    let index_var = null;
                    let type_var = null;
                    let con_var = false;
                    let es = clear_spaces(line);
                    let var_is_multiple = false;
                    for (let j = 0; j < es.length; j++) {
                        let k = es[j];
                        let l = es[j + 1];
                        if (k === "=" || (k === "+" && (l === "=" || l === "+")) || (k === "-" && (l === "=" || l === "-")) || (k === "*" && l === "=") || (k === "/" && l === "=")) {
                            type_var = k;
                            var_is_multiple = k !== "=" && (l === "+" || l === "-");
                            index_var = k === "=" ? j + 1 : j + 2;
                            var_check = true;
                            break;
                        }
                        if (j === 0 && k === "*") {
                            con_var = true;
                        } else {
                            if (!string_reg.test(k) && k !== " ") {
                                break;
                            }
                        }
                        name_var += k;
                    }
                    if (var_check) {
                        name_var = clear_spaces(name_var);
                        while (name_var.startsWith("*")) name_var = name_var.split("").slice(1).join("");
                        const setting = var_is_multiple ? 1 : clear_spaces(es.split("").slice(index_var).join(""));
                        const sid = _set_id++;
                        this.sets[sid] = [name_var, setting, con_var ? "true" : "false", type_var];
                        return this.add_line(new Line(`__set__(${sid})`));
                    }
                    this.add_line(new Line(line));
                } catch (e) {
                    if (e instanceof CompilerError || debug_compiler) {
                        const error = `${langs[lang]["Line"]} ${i + 1}: ${e.message}`;
                        this.emit("on_error", error);
                        this.emit("on_end");
                    }
                }
            });
            return this;
        }

        compile(next) {
            this.end_func = next || (() => {
                if (Object.keys(this.loops).length === 0) this.emit("on_end");
            });
            this.compile_alg(this.line_alg, () => {
                if (this.working && Object.keys(this.loops).length === 0) {
                    this.working = false;
                    this.end_func();
                }
            });
        }

        /**
         * @param {"on_print", "on_stop", "on_end", "on_error", "on_clear"} event
         * @param {function} callback
         */
        on(event, callback) {
            if (!this.events.on[event]) throw new Error("Event '" + event + "' not found.");
            this.events.on[event].push(callback);
        }

        /**
         * @param {"on_print", "on_stop", "on_end", "on_error", "on_clear"} event
         * @param {function} callback
         */
        once(event, callback) {
            if (!this.events.once[event]) throw new Error("Event '" + event + "' not found.");
            this.events.once[event].push(callback);
        }

        /**
         * @param {"on_print", "on_stop", "on_end", "on_error", "on_clear"} event
         * @param {function} callback
         */
        remove_on(event, callback) {
            if (!this.events.on[event]) throw new Error("Event '" + event + "' not found.");
            this.events.on[event] = this.events.on[event].filter(callable => callable !== callback);
        }

        /**
         * @param {"on_print", "on_stop", "on_end", "on_error", "on_clear"} event
         * @param {function} callback
         */
        remove_once(event, callback) {
            if (!this.events.once[event]) throw new Error("Event '" + event + "' not found.");
            this.events.once[event] = this.events.once[event].filter(callable => callable !== callback);
        }

        /**
         * @param {"on_print", "on_stop", "on_end", "on_error", "on_clear"} event
         * @param {any} args
         */
        emit(event, ...args) {
            if (!this.events.on[event]) throw new Error("Event '" + event + "' not found.");
            this.events.on[event].forEach(callable => callable(...args));
            if (!this.events.once[event]) throw new Error("Event '" + event + "' not found.");
            this.events.once[event].forEach(callable => callable(...args));
            this.events.once[event] = [];
        }

        compile_alg(alg, next) {
            compile_lines(alg, next || (() => {
            }), this);
        }
    }

    document._gamey = {
        Compiler,
        langs,
        CompilerError,
        generate_function,
        _err,
        _Raw,
        _String,
        _Number,
        _Callable,
        _Null,
        _Variable,
        _eval,
        compile: (code, def = true) => {
            document._gamey.kill_all();
            const compiler = new Compiler(code.split("\n"));
            if (def) {
                compiler.on("on_print", text => console.info(text));
                compiler.on("on_stop", () => console.info("%c" + langs[lang]["stopped"], 'color: rgb(255, 0, 0)'));
                compiler.on("on_end", () => console.info('%c' + langs[lang]["ended"], 'color: rgb(255, 255, 0)'));
                compiler.on("on_error", err => {
                    throw new CompilerError(err);
                });
                compiler.on("on_clear", () => console.clear());
            }
            compiler.compile();
        },
        any_alive_process: () => Object.values(document._compilers).some(i => i.working === true),
        add_default_function: func => DEFAULT_FUNCTIONS.push(func),
        kill_all: () => {
            Object.values(document._compilers).forEach(i => i.working = false);
        }
    };
})();
