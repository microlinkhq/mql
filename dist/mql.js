(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('url')) :
	typeof define === 'function' && define.amd ? define(['url'], factory) :
	(global = global || self, global.mql = factory(global.url));
}(this, function (url) { 'use strict';

	url = url && url.hasOwnProperty('default') ? url['default'] : url;

	var _rollupPluginShim1 = str => str;

	var _rollupPluginShim1$1 = /*#__PURE__*/Object.freeze({
		'default': _rollupPluginShim1
	});

	const mimicFn = (to, from) => {
		for (const prop of Reflect.ownKeys(from)) {
			Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
		}

		return to;
	};

	var mimicFn_1 = mimicFn;
	var default_1 = mimicFn;
	mimicFn_1.default = default_1;

	var helpers = {
	  isFunction: obj => typeof obj === 'function',
	  isString: obj => typeof obj === 'string',
	  composeErrorMessage: (code, description) => `${code}, ${description}`,
	  inherits: (ctor, superCtor) => {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  }
	};

	const {isFunction, composeErrorMessage} = helpers;

	function interfaceObject (error, ...props) {
	  Object.assign(error, ...props);

	  error.description = isFunction(error.message) ? error.message(error) : error.message;

	  error.message = error.code
	   ? composeErrorMessage(error.code, error.description)
	   : error.description;
	}

	var addErrorProps = interfaceObject;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function getCjsExportFromNamespace (n) {
		return n && n['default'] || n;
	}

	var cleanStack = getCjsExportFromNamespace(_rollupPluginShim1$1);

	const {isString} = helpers;

	function createExtendError (ErrorClass, classProps) {
	  function ExtendError (props) {
	    const error = new ErrorClass();
	    const errorProps = isString(props) ? {message: props} : props;
	    addErrorProps(error, classProps, errorProps);

	    error.stack = cleanStack(error.stack);
	    return error
	  }

	  ExtendError.prototype = ErrorClass.prototype;
	  mimicFn_1(ExtendError, ErrorClass);

	  return ExtendError
	}

	var createExtendError_1 = createExtendError;

	const {inherits} = helpers;


	const REGEX_CLASS_NAME = /[^0-9a-zA-Z_$]/;

	function createError (className) {
	  if (typeof className !== 'string') {
	    throw new TypeError('Expected className to be a string')
	  }

	  if (REGEX_CLASS_NAME.test(className)) {
	    throw new Error('className contains invalid characters')
	  }

	  function ErrorClass () {
	    Object.defineProperty(this, 'name', {
	      configurable: true,
	      value: className,
	      writable: true
	    });

	    Error.captureStackTrace(this, this.constructor);
	  }

	  inherits(ErrorClass, Error);
	  mimicFn_1(ErrorClass, Error);
	  return ErrorClass
	}

	var createError_1 = createError;

	const createErrorClass = ErrorClass => (className, props) => {
	  const errorClass = createError_1(className || ErrorClass.name);
	  return createExtendError_1(errorClass, props)
	};

	var lib = createErrorClass(Error);
	var type = createErrorClass(TypeError);
	var range = createErrorClass(RangeError);
	var eval_1 = createErrorClass(EvalError);
	var syntax = createErrorClass(SyntaxError);
	var reference = createErrorClass(ReferenceError);
	var uri = createErrorClass(URIError);
	lib.type = type;
	lib.range = range;
	lib.eval = eval_1;
	lib.syntax = syntax;
	lib.reference = reference;
	lib.uri = uri;

	function encode(obj, pfx) {
		var k, i, tmp, str='';

		for (k in obj) {
			if ((tmp = obj[k]) !== void 0) {
				if (Array.isArray(tmp)) {
					for (i=0; i < tmp.length; i++) {
						str && (str += '&');
						str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp[i]);
					}
				} else {
					str && (str += '&');
					str += encodeURIComponent(k) + '=' + encodeURIComponent(tmp);
				}
			}
		}

		return (pfx || '') + str;
	}

	function toValue(mix) {
		if (!mix) return '';
		var str = decodeURIComponent(mix);
		if (str === 'false') return false;
		if (str === 'true') return true;
		return (+str * 0 === 0) ? (+str) : str;
	}

	function decode(str) {
		var tmp, k, out={}, arr=str.split('&');

		while (tmp = arr.shift()) {
			tmp = tmp.split('=');
			k = tmp.shift();
			if (out[k] !== void 0) {
				out[k] = [].concat(out[k], toValue(tmp.shift()));
			} else {
				out[k] = toValue(tmp.shift());
			}
		}

		return out;
	}

	var qss_m = /*#__PURE__*/Object.freeze({
		encode: encode,
		decode: decode
	});

	const word = '[a-fA-F\\d:]';
	const b = options => options && options.includeBoundaries ?
		`(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` :
		'';

	const v4 = '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}';

	const v6seg = '[a-fA-F\\d]{1,4}';
	const v6 = `
(
(?:${v6seg}:){7}(?:${v6seg}|:)|                                // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6seg}:){6}(?:${v4}|:${v6seg}|:)|                         // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6seg}:){5}(?::${v4}|(:${v6seg}){1,2}|:)|                 // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6seg}:){4}(?:(:${v6seg}){0,1}:${v4}|(:${v6seg}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6seg}:){3}(?:(:${v6seg}){0,2}:${v4}|(:${v6seg}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6seg}:){2}(?:(:${v6seg}){0,3}:${v4}|(:${v6seg}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6seg}:){1}(?:(:${v6seg}){0,4}:${v4}|(:${v6seg}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::((?::${v6seg}){0,5}:${v4}|(?::${v6seg}){1,7}|:))           // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(%[0-9a-zA-Z]{1,})?                                           // %eth0            %1
`.replace(/\s*\/\/.*$/gm, '').replace(/\n/g, '').trim();

	const ip = options => options && options.exact ?
		new RegExp(`(?:^${v4}$)|(?:^${v6}$)`) :
		new RegExp(`(?:${b(options)}${v4}${b(options)})|(?:${b(options)}${v6}${b(options)})`, 'g');

	ip.v4 = options => options && options.exact ? new RegExp(`^${v4}$`) : new RegExp(`${b(options)}${v4}${b(options)}`, 'g');
	ip.v6 = options => options && options.exact ? new RegExp(`^${v6}$`) : new RegExp(`${b(options)}${v6}${b(options)}`, 'g');

	var ipRegex = ip;

	var tlds = [
	  "aaa",
	  "aarp",
	  "abarth",
	  "abb",
	  "abbott",
	  "abbvie",
	  "abc",
	  "able",
	  "abogado",
	  "abudhabi",
	  "ac",
	  "academy",
	  "accenture",
	  "accountant",
	  "accountants",
	  "aco",
	  "active",
	  "actor",
	  "ad",
	  "adac",
	  "ads",
	  "adult",
	  "ae",
	  "aeg",
	  "aero",
	  "aetna",
	  "af",
	  "afamilycompany",
	  "afl",
	  "africa",
	  "ag",
	  "agakhan",
	  "agency",
	  "ai",
	  "aig",
	  "aigo",
	  "airbus",
	  "airforce",
	  "airtel",
	  "akdn",
	  "al",
	  "alfaromeo",
	  "alibaba",
	  "alipay",
	  "allfinanz",
	  "allstate",
	  "ally",
	  "alsace",
	  "alstom",
	  "am",
	  "americanexpress",
	  "americanfamily",
	  "amex",
	  "amfam",
	  "amica",
	  "amsterdam",
	  "analytics",
	  "android",
	  "anquan",
	  "anz",
	  "ao",
	  "aol",
	  "apartments",
	  "app",
	  "apple",
	  "aq",
	  "aquarelle",
	  "ar",
	  "arab",
	  "aramco",
	  "archi",
	  "army",
	  "arpa",
	  "art",
	  "arte",
	  "as",
	  "asda",
	  "asia",
	  "associates",
	  "at",
	  "athleta",
	  "attorney",
	  "au",
	  "auction",
	  "audi",
	  "audible",
	  "audio",
	  "auspost",
	  "author",
	  "auto",
	  "autos",
	  "avianca",
	  "aw",
	  "aws",
	  "ax",
	  "axa",
	  "az",
	  "azure",
	  "ba",
	  "baby",
	  "baidu",
	  "banamex",
	  "bananarepublic",
	  "band",
	  "bank",
	  "bar",
	  "barcelona",
	  "barclaycard",
	  "barclays",
	  "barefoot",
	  "bargains",
	  "baseball",
	  "basketball",
	  "bauhaus",
	  "bayern",
	  "bb",
	  "bbc",
	  "bbt",
	  "bbva",
	  "bcg",
	  "bcn",
	  "bd",
	  "be",
	  "beats",
	  "beauty",
	  "beer",
	  "bentley",
	  "berlin",
	  "best",
	  "bestbuy",
	  "bet",
	  "bf",
	  "bg",
	  "bh",
	  "bharti",
	  "bi",
	  "bible",
	  "bid",
	  "bike",
	  "bing",
	  "bingo",
	  "bio",
	  "biz",
	  "bj",
	  "black",
	  "blackfriday",
	  "blanco",
	  "blockbuster",
	  "blog",
	  "bloomberg",
	  "blue",
	  "bm",
	  "bms",
	  "bmw",
	  "bn",
	  "bnl",
	  "bnpparibas",
	  "bo",
	  "boats",
	  "boehringer",
	  "bofa",
	  "bom",
	  "bond",
	  "boo",
	  "book",
	  "booking",
	  "bosch",
	  "bostik",
	  "boston",
	  "bot",
	  "boutique",
	  "box",
	  "br",
	  "bradesco",
	  "bridgestone",
	  "broadway",
	  "broker",
	  "brother",
	  "brussels",
	  "bs",
	  "bt",
	  "budapest",
	  "bugatti",
	  "build",
	  "builders",
	  "business",
	  "buy",
	  "buzz",
	  "bv",
	  "bw",
	  "by",
	  "bz",
	  "bzh",
	  "ca",
	  "cab",
	  "cafe",
	  "cal",
	  "call",
	  "calvinklein",
	  "cam",
	  "camera",
	  "camp",
	  "cancerresearch",
	  "canon",
	  "capetown",
	  "capital",
	  "capitalone",
	  "car",
	  "caravan",
	  "cards",
	  "care",
	  "career",
	  "careers",
	  "cars",
	  "cartier",
	  "casa",
	  "case",
	  "caseih",
	  "cash",
	  "casino",
	  "cat",
	  "catering",
	  "catholic",
	  "cba",
	  "cbn",
	  "cbre",
	  "cbs",
	  "cc",
	  "cd",
	  "ceb",
	  "center",
	  "ceo",
	  "cern",
	  "cf",
	  "cfa",
	  "cfd",
	  "cg",
	  "ch",
	  "chanel",
	  "channel",
	  "chase",
	  "chat",
	  "cheap",
	  "chintai",
	  "christmas",
	  "chrome",
	  "chrysler",
	  "church",
	  "ci",
	  "cipriani",
	  "circle",
	  "cisco",
	  "citadel",
	  "citi",
	  "citic",
	  "city",
	  "cityeats",
	  "ck",
	  "cl",
	  "claims",
	  "cleaning",
	  "click",
	  "clinic",
	  "clinique",
	  "clothing",
	  "cloud",
	  "club",
	  "clubmed",
	  "cm",
	  "cn",
	  "co",
	  "coach",
	  "codes",
	  "coffee",
	  "college",
	  "cologne",
	  "com",
	  "comcast",
	  "commbank",
	  "community",
	  "company",
	  "compare",
	  "computer",
	  "comsec",
	  "condos",
	  "construction",
	  "consulting",
	  "contact",
	  "contractors",
	  "cooking",
	  "cookingchannel",
	  "cool",
	  "coop",
	  "corsica",
	  "country",
	  "coupon",
	  "coupons",
	  "courses",
	  "cr",
	  "credit",
	  "creditcard",
	  "creditunion",
	  "cricket",
	  "crown",
	  "crs",
	  "cruise",
	  "cruises",
	  "csc",
	  "cu",
	  "cuisinella",
	  "cv",
	  "cw",
	  "cx",
	  "cy",
	  "cymru",
	  "cyou",
	  "cz",
	  "dabur",
	  "dad",
	  "dance",
	  "data",
	  "date",
	  "dating",
	  "datsun",
	  "day",
	  "dclk",
	  "dds",
	  "de",
	  "deal",
	  "dealer",
	  "deals",
	  "degree",
	  "delivery",
	  "dell",
	  "deloitte",
	  "delta",
	  "democrat",
	  "dental",
	  "dentist",
	  "desi",
	  "design",
	  "dev",
	  "dhl",
	  "diamonds",
	  "diet",
	  "digital",
	  "direct",
	  "directory",
	  "discount",
	  "discover",
	  "dish",
	  "diy",
	  "dj",
	  "dk",
	  "dm",
	  "dnp",
	  "do",
	  "docs",
	  "doctor",
	  "dodge",
	  "dog",
	  "doha",
	  "domains",
	  "dot",
	  "download",
	  "drive",
	  "dtv",
	  "dubai",
	  "duck",
	  "dunlop",
	  "duns",
	  "dupont",
	  "durban",
	  "dvag",
	  "dvr",
	  "dz",
	  "earth",
	  "eat",
	  "ec",
	  "eco",
	  "edeka",
	  "edu",
	  "education",
	  "ee",
	  "eg",
	  "email",
	  "emerck",
	  "energy",
	  "engineer",
	  "engineering",
	  "enterprises",
	  "epost",
	  "epson",
	  "equipment",
	  "er",
	  "ericsson",
	  "erni",
	  "es",
	  "esq",
	  "estate",
	  "esurance",
	  "et",
	  "etisalat",
	  "eu",
	  "eurovision",
	  "eus",
	  "events",
	  "everbank",
	  "exchange",
	  "expert",
	  "exposed",
	  "express",
	  "extraspace",
	  "fage",
	  "fail",
	  "fairwinds",
	  "faith",
	  "family",
	  "fan",
	  "fans",
	  "farm",
	  "farmers",
	  "fashion",
	  "fast",
	  "fedex",
	  "feedback",
	  "ferrari",
	  "ferrero",
	  "fi",
	  "fiat",
	  "fidelity",
	  "fido",
	  "film",
	  "final",
	  "finance",
	  "financial",
	  "fire",
	  "firestone",
	  "firmdale",
	  "fish",
	  "fishing",
	  "fit",
	  "fitness",
	  "fj",
	  "fk",
	  "flickr",
	  "flights",
	  "flir",
	  "florist",
	  "flowers",
	  "fly",
	  "fm",
	  "fo",
	  "foo",
	  "food",
	  "foodnetwork",
	  "football",
	  "ford",
	  "forex",
	  "forsale",
	  "forum",
	  "foundation",
	  "fox",
	  "fr",
	  "free",
	  "fresenius",
	  "frl",
	  "frogans",
	  "frontdoor",
	  "frontier",
	  "ftr",
	  "fujitsu",
	  "fujixerox",
	  "fun",
	  "fund",
	  "furniture",
	  "futbol",
	  "fyi",
	  "ga",
	  "gal",
	  "gallery",
	  "gallo",
	  "gallup",
	  "game",
	  "games",
	  "gap",
	  "garden",
	  "gb",
	  "gbiz",
	  "gd",
	  "gdn",
	  "ge",
	  "gea",
	  "gent",
	  "genting",
	  "george",
	  "gf",
	  "gg",
	  "ggee",
	  "gh",
	  "gi",
	  "gift",
	  "gifts",
	  "gives",
	  "giving",
	  "gl",
	  "glade",
	  "glass",
	  "gle",
	  "global",
	  "globo",
	  "gm",
	  "gmail",
	  "gmbh",
	  "gmo",
	  "gmx",
	  "gn",
	  "godaddy",
	  "gold",
	  "goldpoint",
	  "golf",
	  "goo",
	  "goodhands",
	  "goodyear",
	  "goog",
	  "google",
	  "gop",
	  "got",
	  "gov",
	  "gp",
	  "gq",
	  "gr",
	  "grainger",
	  "graphics",
	  "gratis",
	  "green",
	  "gripe",
	  "grocery",
	  "group",
	  "gs",
	  "gt",
	  "gu",
	  "guardian",
	  "gucci",
	  "guge",
	  "guide",
	  "guitars",
	  "guru",
	  "gw",
	  "gy",
	  "hair",
	  "hamburg",
	  "hangout",
	  "haus",
	  "hbo",
	  "hdfc",
	  "hdfcbank",
	  "health",
	  "healthcare",
	  "help",
	  "helsinki",
	  "here",
	  "hermes",
	  "hgtv",
	  "hiphop",
	  "hisamitsu",
	  "hitachi",
	  "hiv",
	  "hk",
	  "hkt",
	  "hm",
	  "hn",
	  "hockey",
	  "holdings",
	  "holiday",
	  "homedepot",
	  "homegoods",
	  "homes",
	  "homesense",
	  "honda",
	  "honeywell",
	  "horse",
	  "hospital",
	  "host",
	  "hosting",
	  "hot",
	  "hoteles",
	  "hotels",
	  "hotmail",
	  "house",
	  "how",
	  "hr",
	  "hsbc",
	  "ht",
	  "hu",
	  "hughes",
	  "hyatt",
	  "hyundai",
	  "ibm",
	  "icbc",
	  "ice",
	  "icu",
	  "id",
	  "ie",
	  "ieee",
	  "ifm",
	  "ikano",
	  "il",
	  "im",
	  "imamat",
	  "imdb",
	  "immo",
	  "immobilien",
	  "in",
	  "industries",
	  "infiniti",
	  "info",
	  "ing",
	  "ink",
	  "institute",
	  "insurance",
	  "insure",
	  "int",
	  "intel",
	  "international",
	  "intuit",
	  "investments",
	  "io",
	  "ipiranga",
	  "iq",
	  "ir",
	  "irish",
	  "is",
	  "iselect",
	  "ismaili",
	  "ist",
	  "istanbul",
	  "it",
	  "itau",
	  "itv",
	  "iveco",
	  "iwc",
	  "jaguar",
	  "java",
	  "jcb",
	  "jcp",
	  "je",
	  "jeep",
	  "jetzt",
	  "jewelry",
	  "jio",
	  "jlc",
	  "jll",
	  "jm",
	  "jmp",
	  "jnj",
	  "jo",
	  "jobs",
	  "joburg",
	  "jot",
	  "joy",
	  "jp",
	  "jpmorgan",
	  "jprs",
	  "juegos",
	  "juniper",
	  "kaufen",
	  "kddi",
	  "ke",
	  "kerryhotels",
	  "kerrylogistics",
	  "kerryproperties",
	  "kfh",
	  "kg",
	  "kh",
	  "ki",
	  "kia",
	  "kim",
	  "kinder",
	  "kindle",
	  "kitchen",
	  "kiwi",
	  "km",
	  "kn",
	  "koeln",
	  "komatsu",
	  "kosher",
	  "kp",
	  "kpmg",
	  "kpn",
	  "kr",
	  "krd",
	  "kred",
	  "kuokgroup",
	  "kw",
	  "ky",
	  "kyoto",
	  "kz",
	  "la",
	  "lacaixa",
	  "ladbrokes",
	  "lamborghini",
	  "lamer",
	  "lancaster",
	  "lancia",
	  "lancome",
	  "land",
	  "landrover",
	  "lanxess",
	  "lasalle",
	  "lat",
	  "latino",
	  "latrobe",
	  "law",
	  "lawyer",
	  "lb",
	  "lc",
	  "lds",
	  "lease",
	  "leclerc",
	  "lefrak",
	  "legal",
	  "lego",
	  "lexus",
	  "lgbt",
	  "li",
	  "liaison",
	  "lidl",
	  "life",
	  "lifeinsurance",
	  "lifestyle",
	  "lighting",
	  "like",
	  "lilly",
	  "limited",
	  "limo",
	  "lincoln",
	  "linde",
	  "link",
	  "lipsy",
	  "live",
	  "living",
	  "lixil",
	  "lk",
	  "llc",
	  "loan",
	  "loans",
	  "locker",
	  "locus",
	  "loft",
	  "lol",
	  "london",
	  "lotte",
	  "lotto",
	  "love",
	  "lpl",
	  "lplfinancial",
	  "lr",
	  "ls",
	  "lt",
	  "ltd",
	  "ltda",
	  "lu",
	  "lundbeck",
	  "lupin",
	  "luxe",
	  "luxury",
	  "lv",
	  "ly",
	  "ma",
	  "macys",
	  "madrid",
	  "maif",
	  "maison",
	  "makeup",
	  "man",
	  "management",
	  "mango",
	  "map",
	  "market",
	  "marketing",
	  "markets",
	  "marriott",
	  "marshalls",
	  "maserati",
	  "mattel",
	  "mba",
	  "mc",
	  "mckinsey",
	  "md",
	  "me",
	  "med",
	  "media",
	  "meet",
	  "melbourne",
	  "meme",
	  "memorial",
	  "men",
	  "menu",
	  "meo",
	  "merckmsd",
	  "metlife",
	  "mg",
	  "mh",
	  "miami",
	  "microsoft",
	  "mil",
	  "mini",
	  "mint",
	  "mit",
	  "mitsubishi",
	  "mk",
	  "ml",
	  "mlb",
	  "mls",
	  "mm",
	  "mma",
	  "mn",
	  "mo",
	  "mobi",
	  "mobile",
	  "mobily",
	  "moda",
	  "moe",
	  "moi",
	  "mom",
	  "monash",
	  "money",
	  "monster",
	  "mopar",
	  "mormon",
	  "mortgage",
	  "moscow",
	  "moto",
	  "motorcycles",
	  "mov",
	  "movie",
	  "movistar",
	  "mp",
	  "mq",
	  "mr",
	  "ms",
	  "msd",
	  "mt",
	  "mtn",
	  "mtr",
	  "mu",
	  "museum",
	  "mutual",
	  "mv",
	  "mw",
	  "mx",
	  "my",
	  "mz",
	  "na",
	  "nab",
	  "nadex",
	  "nagoya",
	  "name",
	  "nationwide",
	  "natura",
	  "navy",
	  "nba",
	  "nc",
	  "ne",
	  "nec",
	  "net",
	  "netbank",
	  "netflix",
	  "network",
	  "neustar",
	  "new",
	  "newholland",
	  "news",
	  "next",
	  "nextdirect",
	  "nexus",
	  "nf",
	  "nfl",
	  "ng",
	  "ngo",
	  "nhk",
	  "ni",
	  "nico",
	  "nike",
	  "nikon",
	  "ninja",
	  "nissan",
	  "nissay",
	  "nl",
	  "no",
	  "nokia",
	  "northwesternmutual",
	  "norton",
	  "now",
	  "nowruz",
	  "nowtv",
	  "np",
	  "nr",
	  "nra",
	  "nrw",
	  "ntt",
	  "nu",
	  "nyc",
	  "nz",
	  "obi",
	  "observer",
	  "off",
	  "office",
	  "okinawa",
	  "olayan",
	  "olayangroup",
	  "oldnavy",
	  "ollo",
	  "om",
	  "omega",
	  "one",
	  "ong",
	  "onl",
	  "online",
	  "onyourside",
	  "ooo",
	  "open",
	  "oracle",
	  "orange",
	  "org",
	  "organic",
	  "origins",
	  "osaka",
	  "otsuka",
	  "ott",
	  "ovh",
	  "pa",
	  "page",
	  "panasonic",
	  "panerai",
	  "paris",
	  "pars",
	  "partners",
	  "parts",
	  "party",
	  "passagens",
	  "pay",
	  "pccw",
	  "pe",
	  "pet",
	  "pf",
	  "pfizer",
	  "pg",
	  "ph",
	  "pharmacy",
	  "phd",
	  "philips",
	  "phone",
	  "photo",
	  "photography",
	  "photos",
	  "physio",
	  "piaget",
	  "pics",
	  "pictet",
	  "pictures",
	  "pid",
	  "pin",
	  "ping",
	  "pink",
	  "pioneer",
	  "pizza",
	  "pk",
	  "pl",
	  "place",
	  "play",
	  "playstation",
	  "plumbing",
	  "plus",
	  "pm",
	  "pn",
	  "pnc",
	  "pohl",
	  "poker",
	  "politie",
	  "porn",
	  "post",
	  "pr",
	  "pramerica",
	  "praxi",
	  "press",
	  "prime",
	  "pro",
	  "prod",
	  "productions",
	  "prof",
	  "progressive",
	  "promo",
	  "properties",
	  "property",
	  "protection",
	  "pru",
	  "prudential",
	  "ps",
	  "pt",
	  "pub",
	  "pw",
	  "pwc",
	  "py",
	  "qa",
	  "qpon",
	  "quebec",
	  "quest",
	  "qvc",
	  "racing",
	  "radio",
	  "raid",
	  "re",
	  "read",
	  "realestate",
	  "realtor",
	  "realty",
	  "recipes",
	  "red",
	  "redstone",
	  "redumbrella",
	  "rehab",
	  "reise",
	  "reisen",
	  "reit",
	  "reliance",
	  "ren",
	  "rent",
	  "rentals",
	  "repair",
	  "report",
	  "republican",
	  "rest",
	  "restaurant",
	  "review",
	  "reviews",
	  "rexroth",
	  "rich",
	  "richardli",
	  "ricoh",
	  "rightathome",
	  "ril",
	  "rio",
	  "rip",
	  "rmit",
	  "ro",
	  "rocher",
	  "rocks",
	  "rodeo",
	  "rogers",
	  "room",
	  "rs",
	  "rsvp",
	  "ru",
	  "rugby",
	  "ruhr",
	  "run",
	  "rw",
	  "rwe",
	  "ryukyu",
	  "sa",
	  "saarland",
	  "safe",
	  "safety",
	  "sakura",
	  "sale",
	  "salon",
	  "samsclub",
	  "samsung",
	  "sandvik",
	  "sandvikcoromant",
	  "sanofi",
	  "sap",
	  "sapo",
	  "sarl",
	  "sas",
	  "save",
	  "saxo",
	  "sb",
	  "sbi",
	  "sbs",
	  "sc",
	  "sca",
	  "scb",
	  "schaeffler",
	  "schmidt",
	  "scholarships",
	  "school",
	  "schule",
	  "schwarz",
	  "science",
	  "scjohnson",
	  "scor",
	  "scot",
	  "sd",
	  "se",
	  "search",
	  "seat",
	  "secure",
	  "security",
	  "seek",
	  "select",
	  "sener",
	  "services",
	  "ses",
	  "seven",
	  "sew",
	  "sex",
	  "sexy",
	  "sfr",
	  "sg",
	  "sh",
	  "shangrila",
	  "sharp",
	  "shaw",
	  "shell",
	  "shia",
	  "shiksha",
	  "shoes",
	  "shop",
	  "shopping",
	  "shouji",
	  "show",
	  "showtime",
	  "shriram",
	  "si",
	  "silk",
	  "sina",
	  "singles",
	  "site",
	  "sj",
	  "sk",
	  "ski",
	  "skin",
	  "sky",
	  "skype",
	  "sl",
	  "sling",
	  "sm",
	  "smart",
	  "smile",
	  "sn",
	  "sncf",
	  "so",
	  "soccer",
	  "social",
	  "softbank",
	  "software",
	  "sohu",
	  "solar",
	  "solutions",
	  "song",
	  "sony",
	  "soy",
	  "space",
	  "spiegel",
	  "sport",
	  "spot",
	  "spreadbetting",
	  "sr",
	  "srl",
	  "srt",
	  "st",
	  "stada",
	  "staples",
	  "star",
	  "starhub",
	  "statebank",
	  "statefarm",
	  "statoil",
	  "stc",
	  "stcgroup",
	  "stockholm",
	  "storage",
	  "store",
	  "stream",
	  "studio",
	  "study",
	  "style",
	  "su",
	  "sucks",
	  "supplies",
	  "supply",
	  "support",
	  "surf",
	  "surgery",
	  "suzuki",
	  "sv",
	  "swatch",
	  "swiftcover",
	  "swiss",
	  "sx",
	  "sy",
	  "sydney",
	  "symantec",
	  "systems",
	  "sz",
	  "tab",
	  "taipei",
	  "talk",
	  "taobao",
	  "target",
	  "tatamotors",
	  "tatar",
	  "tattoo",
	  "tax",
	  "taxi",
	  "tc",
	  "tci",
	  "td",
	  "tdk",
	  "team",
	  "tech",
	  "technology",
	  "tel",
	  "telecity",
	  "telefonica",
	  "temasek",
	  "tennis",
	  "teva",
	  "tf",
	  "tg",
	  "th",
	  "thd",
	  "theater",
	  "theatre",
	  "tiaa",
	  "tickets",
	  "tienda",
	  "tiffany",
	  "tips",
	  "tires",
	  "tirol",
	  "tj",
	  "tjmaxx",
	  "tjx",
	  "tk",
	  "tkmaxx",
	  "tl",
	  "tm",
	  "tmall",
	  "tn",
	  "to",
	  "today",
	  "tokyo",
	  "tools",
	  "top",
	  "toray",
	  "toshiba",
	  "total",
	  "tours",
	  "town",
	  "toyota",
	  "toys",
	  "tr",
	  "trade",
	  "trading",
	  "training",
	  "travel",
	  "travelchannel",
	  "travelers",
	  "travelersinsurance",
	  "trust",
	  "trv",
	  "tt",
	  "tube",
	  "tui",
	  "tunes",
	  "tushu",
	  "tv",
	  "tvs",
	  "tw",
	  "tz",
	  "ua",
	  "ubank",
	  "ubs",
	  "uconnect",
	  "ug",
	  "uk",
	  "unicom",
	  "university",
	  "uno",
	  "uol",
	  "ups",
	  "us",
	  "uy",
	  "uz",
	  "va",
	  "vacations",
	  "vana",
	  "vanguard",
	  "vc",
	  "ve",
	  "vegas",
	  "ventures",
	  "verisign",
	  "versicherung",
	  "vet",
	  "vg",
	  "vi",
	  "viajes",
	  "video",
	  "vig",
	  "viking",
	  "villas",
	  "vin",
	  "vip",
	  "virgin",
	  "visa",
	  "vision",
	  "vista",
	  "vistaprint",
	  "viva",
	  "vivo",
	  "vlaanderen",
	  "vn",
	  "vodka",
	  "volkswagen",
	  "volvo",
	  "vote",
	  "voting",
	  "voto",
	  "voyage",
	  "vu",
	  "vuelos",
	  "wales",
	  "walmart",
	  "walter",
	  "wang",
	  "wanggou",
	  "warman",
	  "watch",
	  "watches",
	  "weather",
	  "weatherchannel",
	  "webcam",
	  "weber",
	  "website",
	  "wed",
	  "wedding",
	  "weibo",
	  "weir",
	  "wf",
	  "whoswho",
	  "wien",
	  "wiki",
	  "williamhill",
	  "win",
	  "windows",
	  "wine",
	  "winners",
	  "wme",
	  "wolterskluwer",
	  "woodside",
	  "work",
	  "works",
	  "world",
	  "wow",
	  "ws",
	  "wtc",
	  "wtf",
	  "xbox",
	  "xerox",
	  "xfinity",
	  "xihuan",
	  "xin",
	  "कॉम", // xn--11b4c3d
	  "セール", // xn--1ck2e1b
	  "佛山", // xn--1qqw23a
	  "ಭಾರತ", // xn--2scrj9c
	  "慈善", // xn--30rr7y
	  "集团", // xn--3bst00m
	  "在线", // xn--3ds443g
	  "한국", // xn--3e0b707e
	  "ଭାରତ", // xn--3hcrj9c
	  "大众汽车", // xn--3oq18vl8pn36a
	  "点看", // xn--3pxu8k
	  "คอม", // xn--42c2d9a
	  "ভাৰত", // xn--45br5cyl
	  "ভারত", // xn--45brj9c
	  "八卦", // xn--45q11c
	  "موقع", // xn--4gbrim
	  "বাংলা", // xn--54b7fta0cc
	  "公益", // xn--55qw42g
	  "公司", // xn--55qx5d
	  "香格里拉", // xn--5su34j936bgsg
	  "网站", // xn--5tzm5g
	  "移动", // xn--6frz82g
	  "我爱你", // xn--6qq986b3xl
	  "москва", // xn--80adxhks
	  "қаз", // xn--80ao21a
	  "католик", // xn--80aqecdr1a
	  "онлайн", // xn--80asehdb
	  "сайт", // xn--80aswg
	  "联通", // xn--8y0a063a
	  "срб", // xn--90a3ac
	  "бг", // xn--90ae
	  "бел", // xn--90ais
	  "קום", // xn--9dbq2a
	  "时尚", // xn--9et52u
	  "微博", // xn--9krt00a
	  "淡马锡", // xn--b4w605ferd
	  "ファッション", // xn--bck1b9a5dre4c
	  "орг", // xn--c1avg
	  "नेट", // xn--c2br7g
	  "ストア", // xn--cck2b3b
	  "삼성", // xn--cg4bki
	  "சிங்கப்பூர்", // xn--clchc0ea0b2g2a9gcd
	  "商标", // xn--czr694b
	  "商店", // xn--czrs0t
	  "商城", // xn--czru2d
	  "дети", // xn--d1acj3b
	  "мкд", // xn--d1alf
	  "ею", // xn--e1a4c
	  "ポイント", // xn--eckvdtc9d
	  "新闻", // xn--efvy88h
	  "工行", // xn--estv75g
	  "家電", // xn--fct429k
	  "كوم", // xn--fhbei
	  "中文网", // xn--fiq228c5hs
	  "中信", // xn--fiq64b
	  "中国", // xn--fiqs8s
	  "中國", // xn--fiqz9s
	  "娱乐", // xn--fjq720a
	  "谷歌", // xn--flw351e
	  "భారత్", // xn--fpcrj9c3d
	  "ලංකා", // xn--fzc2c9e2c
	  "電訊盈科", // xn--fzys8d69uvgm
	  "购物", // xn--g2xx48c
	  "クラウド", // xn--gckr3f0f
	  "ભારત", // xn--gecrj9c
	  "通販", // xn--gk3at1e
	  "भारतम्", // xn--h2breg3eve
	  "भारत", // xn--h2brj9c
	  "भारोत", // xn--h2brj9c8c
	  "网店", // xn--hxt814e
	  "संगठन", // xn--i1b6b1a6a2e
	  "餐厅", // xn--imr513n
	  "网络", // xn--io0a7i
	  "ком", // xn--j1aef
	  "укр", // xn--j1amh
	  "香港", // xn--j6w193g
	  "诺基亚", // xn--jlq61u9w7b
	  "食品", // xn--jvr189m
	  "飞利浦", // xn--kcrx77d1x4a
	  "台湾", // xn--kprw13d
	  "台灣", // xn--kpry57d
	  "手表", // xn--kpu716f
	  "手机", // xn--kput3i
	  "мон", // xn--l1acc
	  "الجزائر", // xn--lgbbat1ad8j
	  "عمان", // xn--mgb9awbf
	  "ارامكو", // xn--mgba3a3ejt
	  "ایران", // xn--mgba3a4f16a
	  "العليان", // xn--mgba7c0bbn0a
	  "اتصالات", // xn--mgbaakc7dvf
	  "امارات", // xn--mgbaam7a8h
	  "بازار", // xn--mgbab2bd
	  "پاکستان", // xn--mgbai9azgqp6j
	  "الاردن", // xn--mgbayh7gpa
	  "موبايلي", // xn--mgbb9fbpob
	  "بارت", // xn--mgbbh1a
	  "بھارت", // xn--mgbbh1a71e
	  "المغرب", // xn--mgbc0a9azcg
	  "ابوظبي", // xn--mgbca7dzdo
	  "السعودية", // xn--mgberp4a5d4ar
	  "ڀارت", // xn--mgbgu82a
	  "كاثوليك", // xn--mgbi4ecexp
	  "سودان", // xn--mgbpl2fh
	  "همراه", // xn--mgbt3dhd
	  "عراق", // xn--mgbtx2b
	  "مليسيا", // xn--mgbx4cd0ab
	  "澳門", // xn--mix891f
	  "닷컴", // xn--mk1bu44c
	  "政府", // xn--mxtq1m
	  "شبكة", // xn--ngbc5azd
	  "بيتك", // xn--ngbe9e0a
	  "عرب", // xn--ngbrx
	  "გე", // xn--node
	  "机构", // xn--nqv7f
	  "组织机构", // xn--nqv7fs00ema
	  "健康", // xn--nyqy26a
	  "ไทย", // xn--o3cw4h
	  "سورية", // xn--ogbpf8fl
	  "招聘", // xn--otu796d
	  "рус", // xn--p1acf
	  "рф", // xn--p1ai
	  "珠宝", // xn--pbt977c
	  "تونس", // xn--pgbs0dh
	  "大拿", // xn--pssy2u
	  "みんな", // xn--q9jyb4c
	  "グーグル", // xn--qcka1pmc
	  "ελ", // xn--qxam
	  "世界", // xn--rhqv96g
	  "書籍", // xn--rovu88b
	  "ഭാരതം", // xn--rvc1e0am3e
	  "ਭਾਰਤ", // xn--s9brj9c
	  "网址", // xn--ses554g
	  "닷넷", // xn--t60b56a
	  "コム", // xn--tckwe
	  "天主教", // xn--tiq49xqyj
	  "游戏", // xn--unup4y
	  "vermögensberater", // xn--vermgensberater-ctb
	  "vermögensberatung", // xn--vermgensberatung-pwb
	  "企业", // xn--vhquv
	  "信息", // xn--vuq861b
	  "嘉里大酒店", // xn--w4r85el8fhu5dnra
	  "嘉里", // xn--w4rs40l
	  "مصر", // xn--wgbh1c
	  "قطر", // xn--wgbl6a
	  "广东", // xn--xhq521b
	  "இலங்கை", // xn--xkc2al3hye2a
	  "இந்தியா", // xn--xkc2dl3a5ee0h
	  "հայ", // xn--y9a3aq
	  "新加坡", // xn--yfro4i67o
	  "فلسطين", // xn--ygbi2ammx
	  "政务", // xn--zfr164b
	  "xperia",
	  "xxx",
	  "xyz",
	  "yachts",
	  "yahoo",
	  "yamaxun",
	  "yandex",
	  "ye",
	  "yodobashi",
	  "yoga",
	  "yokohama",
	  "you",
	  "youtube",
	  "yt",
	  "yun",
	  "za",
	  "zappos",
	  "zara",
	  "zero",
	  "zip",
	  "zippo",
	  "zm",
	  "zone",
	  "zuerich",
	  "zw"
	];

	var urlRegex = options => {
		options = {
			strict: true,
			...options
		};

		const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? '' : '?'}`;
		const auth = '(?:\\S+(?::\\S*)?@)?';
		const ip = ipRegex.v4().source;
		const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
		const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
		const tld = `(?:\\.${options.strict ? '(?:[a-z\\u00a1-\\uffff]{2,})' : `(?:${tlds.sort((a, b) => b.length - a.length).join('|')})`})\\.?`;
		const port = '(?::\\d{2,5})?';
		const path = '(?:[/?#][^\\s"]*)?';
		const regex = `(?:${protocol}|www\\.)${auth}(?:localhost|${ip}|${host}${domain}${tld})${port}${path}`;

		return options.exact ? new RegExp(`(?:^${regex}$)`, 'i') : new RegExp(regex, 'ig');
	};

	const URL$1 = commonjsGlobal.window ? window.URL : url.URL;
	const urlRegex$1 = urlRegex({ exact: true });

	const REGEX_HTTP_PROTOCOL = /^https?:\/\//i;

	var isUrlHttp = url => {
	  try {
	    return new URL$1(url) && REGEX_HTTP_PROTOCOL.test(url) && urlRegex$1.test(url)
	  } catch (err) {
	    return false
	  }
	};

	var umd = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		factory(exports);
	}(commonjsGlobal, function (exports) {
		/*! MIT License © Sindre Sorhus */

		const getGlobal = property => {
			/* istanbul ignore next */
			if (typeof self !== 'undefined' && self && property in self) {
				return self[property];
			}

			/* istanbul ignore next */
			if (typeof window !== 'undefined' && window && property in window) {
				return window[property];
			}

			if (typeof commonjsGlobal !== 'undefined' && commonjsGlobal && property in commonjsGlobal) {
				return commonjsGlobal[property];
			}

			/* istanbul ignore next */
			if (typeof globalThis !== 'undefined' && globalThis) {
				return globalThis[property];
			}
		};

		const document = getGlobal('document');
		const Headers = getGlobal('Headers');
		const Response = getGlobal('Response');
		const ReadableStream = getGlobal('ReadableStream');
		const fetch = getGlobal('fetch');
		const AbortController = getGlobal('AbortController');
		const FormData = getGlobal('FormData');

		const isObject = value => value !== null && typeof value === 'object';
		const supportsAbortController = typeof AbortController === 'function';
		const supportsStreams = typeof ReadableStream === 'function';
		const supportsFormData = typeof FormData === 'function';

		const deepMerge = (...sources) => {
			let returnValue = {};

			for (const source of sources) {
				if (Array.isArray(source)) {
					if (!(Array.isArray(returnValue))) {
						returnValue = [];
					}

					returnValue = [...returnValue, ...source];
				} else if (isObject(source)) {
					for (let [key, value] of Object.entries(source)) {
						if (isObject(value) && Reflect.has(returnValue, key)) {
							value = deepMerge(returnValue[key], value);
						}

						returnValue = {...returnValue, [key]: value};
					}
				}
			}

			return returnValue;
		};

		const requestMethods = [
			'get',
			'post',
			'put',
			'patch',
			'head',
			'delete'
		];

		const responseTypes = {
			json: 'application/json',
			text: 'text/*',
			formData: 'multipart/form-data',
			arrayBuffer: '*/*',
			blob: '*/*'
		};

		const retryMethods = new Set([
			'get',
			'put',
			'head',
			'delete',
			'options',
			'trace'
		]);

		const retryStatusCodes = new Set([
			408,
			413,
			429,
			500,
			502,
			503,
			504
		]);

		const retryAfterStatusCodes = new Set([
			413,
			429,
			503
		]);

		class HTTPError extends Error {
			constructor(response) {
				super(response.statusText);
				this.name = 'HTTPError';
				this.response = response;
			}
		}

		class TimeoutError extends Error {
			constructor() {
				super('Request timed out');
				this.name = 'TimeoutError';
			}
		}

		const delay = ms => new Promise((resolve, reject) => {
			if (ms > 2147483647) { // The maximum value of a 32bit int (see #117)
				reject(new RangeError('The `timeout` option cannot be greater than 2147483647'));
			} else {
				setTimeout(resolve, ms);
			}
		});

		// `Promise.race()` workaround (#91)
		const timeout = (promise, ms, abortController) => new Promise((resolve, reject) => {
			/* eslint-disable promise/prefer-await-to-then */
			promise.then(resolve).catch(reject);
			delay(ms).then(() => {
				if (supportsAbortController) {
					abortController.abort();
				}

				reject(new TimeoutError());
			}).catch(reject);
			/* eslint-enable promise/prefer-await-to-then */
		});

		const normalizeRequestMethod = input => requestMethods.includes(input) ? input.toUpperCase() : input;

		class Ky {
			constructor(input, {
				timeout = 10000,
				hooks,
				throwHttpErrors = true,
				searchParams,
				json,
				...otherOptions
			}) {
				this._retryCount = 0;

				this._options = {
					method: 'get',
					credentials: 'same-origin', // TODO: This can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
					retry: 2,
					...otherOptions
				};

				if (supportsAbortController) {
					this.abortController = new AbortController();
					if (this._options.signal) {
						this._options.signal.addEventListener('abort', () => {
							this.abortController.abort();
						});
					}

					this._options.signal = this.abortController.signal;
				}

				this._options.method = normalizeRequestMethod(this._options.method);
				this._options.prefixUrl = String(this._options.prefixUrl || '');
				this._input = String(input || '');

				if (this._options.prefixUrl && this._input.startsWith('/')) {
					throw new Error('`input` must not begin with a slash when using `prefixUrl`');
				}

				if (this._options.prefixUrl && !this._options.prefixUrl.endsWith('/')) {
					this._options.prefixUrl += '/';
				}

				this._input = this._options.prefixUrl + this._input;

				if (searchParams) {
					const url = new URL(this._input, document && document.baseURI);
					if (typeof searchParams === 'string' || (URLSearchParams && searchParams instanceof URLSearchParams)) {
						url.search = searchParams;
					} else if (Object.values(searchParams).every(param => typeof param === 'number' || typeof param === 'string')) {
						url.search = new URLSearchParams(searchParams).toString();
					} else {
						throw new Error('The `searchParams` option must be either a string, `URLSearchParams` instance or an object with string and number values');
					}

					this._input = url.toString();
				}

				this._timeout = timeout;
				this._hooks = deepMerge({
					beforeRequest: [],
					afterResponse: []
				}, hooks);
				this._throwHttpErrors = throwHttpErrors;

				const headers = new Headers(this._options.headers || {});

				if (((supportsFormData && this._options.body instanceof FormData) || this._options.body instanceof URLSearchParams) && headers.has('content-type')) {
					throw new Error(`The \`content-type\` header cannot be used with a ${this._options.body.constructor.name} body. It will be set automatically.`);
				}

				if (json) {
					if (this._options.body) {
						throw new Error('The `json` option cannot be used with the `body` option');
					}

					headers.set('content-type', 'application/json');
					this._options.body = JSON.stringify(json);
				}

				this._options.headers = headers;

				const fn = async () => {
					await delay(1);
					let response = await this._fetch();

					for (const hook of this._hooks.afterResponse) {
						// eslint-disable-next-line no-await-in-loop
						const modifiedResponse = await hook(response.clone());

						if (modifiedResponse instanceof Response) {
							response = modifiedResponse;
						}
					}

					if (!response.ok && this._throwHttpErrors) {
						throw new HTTPError(response);
					}

					// If `onDownloadProgress` is passed, it uses the stream API internally
					/* istanbul ignore next */
					if (this._options.onDownloadProgress) {
						if (typeof this._options.onDownloadProgress !== 'function') {
							throw new TypeError('The `onDownloadProgress` option must be a function');
						}

						if (!supportsStreams) {
							throw new Error('Streams are not supported in your environment. `ReadableStream` is missing.');
						}

						return this._stream(response.clone(), this._options.onDownloadProgress);
					}

					return response;
				};

				const isRetriableMethod = retryMethods.has(this._options.method.toLowerCase());
				const result = isRetriableMethod ? this._retry(fn) : fn();

				for (const [type, mimeType] of Object.entries(responseTypes)) {
					result[type] = async () => {
						headers.set('accept', mimeType);
						return (await result).clone()[type]();
					};
				}

				return result;
			}

			_calculateRetryDelay(error) {
				this._retryCount++;

				if (this._retryCount < this._options.retry && !(error instanceof TimeoutError)) {
					if (error instanceof HTTPError) {
						if (!retryStatusCodes.has(error.response.status)) {
							return 0;
						}

						const retryAfter = error.response.headers.get('Retry-After');
						if (retryAfter && retryAfterStatusCodes.has(error.response.status)) {
							let after = Number(retryAfter);
							if (Number.isNaN(after)) {
								after = Date.parse(retryAfter) - Date.now();
							} else {
								after *= 1000;
							}

							return after;
						}

						if (error.response.status === 413) {
							return 0;
						}
					}

					const BACKOFF_FACTOR = 0.3;
					return BACKOFF_FACTOR * (2 ** (this._retryCount - 1)) * 1000;
				}

				return 0;
			}

			async _retry(fn) {
				try {
					return await fn();
				} catch (error) {
					const ms = this._calculateRetryDelay(error);
					if (ms !== 0 && this._retryCount > 0) {
						await delay(ms);
						return this._retry(fn);
					}

					if (this._throwHttpErrors) {
						throw error;
					}
				}
			}

			async _fetch() {
				for (const hook of this._hooks.beforeRequest) {
					// eslint-disable-next-line no-await-in-loop
					await hook(this._options);
				}

				if (this._timeout === false) {
					return fetch(this._input, this._options);
				}

				return timeout(fetch(this._input, this._options), this._timeout, this.abortController);
			}

			/* istanbul ignore next */
			_stream(response, onDownloadProgress) {
				const totalBytes = Number(response.headers.get('content-length')) || 0;
				let transferredBytes = 0;

				return new Response(
					new ReadableStream({
						start(controller) {
							const reader = response.body.getReader();

							if (onDownloadProgress) {
								onDownloadProgress({percent: 0, transferredBytes: 0, totalBytes}, new Uint8Array());
							}

							async function read() {
								const {done, value} = await reader.read();
								if (done) {
									controller.close();
									return;
								}

								if (onDownloadProgress) {
									transferredBytes += value.byteLength;
									const percent = totalBytes === 0 ? 0 : transferredBytes / totalBytes;
									onDownloadProgress({percent, transferredBytes, totalBytes}, value);
								}

								controller.enqueue(value);
								read();
							}

							read();
						}
					})
				);
			}
		}

		const validateAndMerge = (...sources) => {
			for (const source of sources) {
				if ((!isObject(source) || Array.isArray(source)) && typeof source !== 'undefined') {
					throw new TypeError('The `options` argument must be an object');
				}
			}

			return deepMerge({}, ...sources);
		};

		const createInstance = defaults => {
			const ky = (input, options) => new Ky(input, validateAndMerge(defaults, options));

			for (const method of requestMethods) {
				ky[method] = (input, options) => new Ky(input, validateAndMerge(defaults, options, {method}));
			}

			ky.create = newDefaults => createInstance(validateAndMerge(newDefaults));
			ky.extend = newDefaults => createInstance(validateAndMerge(defaults, newDefaults));

			return ky;
		};

		var index = createInstance();

		exports.HTTPError = HTTPError;
		exports.TimeoutError = TimeoutError;
		exports.default = index;

		Object.defineProperty(exports, '__esModule', { value: true });

	}));
	});

	unwrapExports(umd);

	var kyUmd = umd;

	/*!
	 * Determine if an object is a Buffer
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */

	var isBuffer = function isBuffer (obj) {
	  return obj != null && obj.constructor != null &&
	    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	};

	var flat = flatten;
	flatten.flatten = flatten;
	flatten.unflatten = unflatten;

	function flatten (target, opts) {
	  opts = opts || {};

	  var delimiter = opts.delimiter || '.';
	  var maxDepth = opts.maxDepth;
	  var output = {};

	  function step (object, prev, currentDepth) {
	    currentDepth = currentDepth || 1;
	    Object.keys(object).forEach(function (key) {
	      var value = object[key];
	      var isarray = opts.safe && Array.isArray(value);
	      var type = Object.prototype.toString.call(value);
	      var isbuffer = isBuffer(value);
	      var isobject = (
	        type === '[object Object]' ||
	        type === '[object Array]'
	      );

	      var newKey = prev
	        ? prev + delimiter + key
	        : key;

	      if (!isarray && !isbuffer && isobject && Object.keys(value).length &&
	        (!opts.maxDepth || currentDepth < maxDepth)) {
	        return step(value, newKey, currentDepth + 1)
	      }

	      output[newKey] = value;
	    });
	  }

	  step(target);

	  return output
	}

	function unflatten (target, opts) {
	  opts = opts || {};

	  var delimiter = opts.delimiter || '.';
	  var overwrite = opts.overwrite || false;
	  var result = {};

	  var isbuffer = isBuffer(target);
	  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
	    return target
	  }

	  // safely ensure that the key is
	  // an integer.
	  function getkey (key) {
	    var parsedKey = Number(key);

	    return (
	      isNaN(parsedKey) ||
	      key.indexOf('.') !== -1 ||
	      opts.object
	    ) ? key
	      : parsedKey
	  }

	  var sortedKeys = Object.keys(target).sort(function (keyA, keyB) {
	    return keyA.length - keyB.length
	  });

	  sortedKeys.forEach(function (key) {
	    var split = key.split(delimiter);
	    var key1 = getkey(split.shift());
	    var key2 = getkey(split[0]);
	    var recipient = result;

	    while (key2 !== undefined) {
	      var type = Object.prototype.toString.call(recipient[key1]);
	      var isobject = (
	        type === '[object Object]' ||
	        type === '[object Array]'
	      );

	      // do not write over falsey, non-undefined values if overwrite is false
	      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
	        return
	      }

	      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
	        recipient[key1] = (
	          typeof key2 === 'number' &&
	          !opts.object ? [] : {}
	        );
	      }

	      recipient = recipient[key1];
	      if (split.length > 0) {
	        key1 = getkey(split.shift());
	        key2 = getkey(split[0]);
	      }
	    }

	    // unflatten again for 'messy objects'
	    recipient[key1] = unflatten(target[key], opts);
	  });

	  return result
	}

	const ENDPOINT = {
	  FREE: 'https://api.microlink.io',
	  PRO: 'https://pro.microlink.io'
	};

	const ERRORS_CODE = {
	  INVALID_URL: 'ENOVALIDURL',
	  FAILED: 'EFAILED'
	};

	function factory ({
	  VERSION,
	  MicrolinkError,
	  isUrlHttp,
	  stringify,
	  got,
	  flatten
	}) {
	  const assertUrl = (url = '') => {
	    if (!isUrlHttp(url)) {
	      throw new MicrolinkError({
	        url,
	        code: ERRORS_CODE.INVALID_URL,
	        message: `The URL \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
	      })
	    }
	  };

	  const mapRules = (rules = {}) => {
	    const flatRules = flatten(rules);
	    return Object.keys(flatRules).reduce(
	      (acc, key) => ({ ...acc, [`data.${key}`]: flatRules[key] }),
	      {}
	    )
	  };

	  const fetchFromApi = async (url, opts) => {
	    try {
	      const response = await got(url, opts);
	      const { body } = response;
	      return { ...body, response }
	    } catch (err) {
	      const body = err.body
	        ? typeof err.body === 'string' || Buffer.isBuffer(err.body)
	          ? JSON.parse(err.body)
	          : err.body
	        : { message: err.message, status: 'fail' };
	      const { statusCode = 500 } = err;
	      throw MicrolinkError({
	        ...body,
	        url,
	        statusCode,
	        code: ERRORS_CODE.FAILED
	      })
	    }
	  };

	  const apiUrl = (url, { rules, apiKey, endpoint, ...opts } = {}) => {
	    const isPro = !!apiKey;
	    const apiEndpoint = endpoint || ENDPOINT[isPro ? 'PRO' : 'FREE'];

	    const apiUrl = `${apiEndpoint}?${stringify({
      url: url,
      ...mapRules(rules),
      ...opts
    })}`;

	    const headers = isPro ? { 'x-api-key': apiKey } : {};
	    return [apiUrl, { headers }]
	  };

	  const mql = async (
	    targetUrl,
	    {
	      encoding = 'utf8',
	      cache = null,
	      retry = 3,
	      timeout = 25000,
	      json = true,
	      ...opts
	    } = {}
	  ) => {
	    assertUrl(targetUrl);
	    const [url, { headers }] = apiUrl(targetUrl, opts);
	    return fetchFromApi(url, {
	      encoding,
	      cache,
	      retry,
	      timeout,
	      headers,
	      json
	    })
	  };

	  mql.MicrolinkError = MicrolinkError;
	  mql.apiUrl = apiUrl;
	  mql.mapRules = mapRules;
	  mql.version = VERSION;

	  return mql
	}

	var factory_1 = factory;

	const MicrolinkError = lib('MicrolinkError');
	const { encode: stringify } = qss_m;

	const { default: ky } = kyUmd;




	// TODO: `cache` is destructuring because is not supported on browser side yet.
	// TODO: `json` because always is the output serialized.
	const got = async (url, { json, headers, cache, ...opts }) => {
	  try {
	    const response = await ky(url, opts);
	    const body = await response.json();
	    const { headers, status: statusCode, statusText: statusMessage } = response;
	    return { url: response.url, body, headers, statusCode, statusMessage }
	  } catch (err) {
	    err.body = err.response ? await err.response.json() : '';
	    err.statusCode = err.response.status;
	    err.headers = err.response.headers;
	    throw err
	  }
	};

	const browser = factory_1({
	  MicrolinkError,
	  isUrlHttp,
	  stringify,
	  got,
	  flatten: flat,
	  VERSION: '0.3.13'
	});

	var browser_1 = browser;

	return browser_1;

}));
//# sourceMappingURL=mql.js.map
