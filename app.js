const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// dotenv를 사용하여 .env 파일의 내용을 process.env에 로드합니다.

// MySQL Database Configuration
const dbConfig = {
  host: '10.139.208.3',
  user: 'root',
  password: '0000',
  database: 'pi'
};

// MySQL Connection Pool
const pool = mysql.createPool(dbConfig);

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// 미들웨어 등록
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// EJS 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 정적 파일 서비스 (styles.css, frontend.js 등)
app.use(express.static(__dirname));

// 라우트: 메인 페이지
app.get('/', (req, res) => {
res.sendFile(__dirname + '/index.html');
});

// 라우트: 로그인 페이지
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// 라우트: 회원가입 페이지
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// 라우트: 로그인 요청 처리
app.post('/login', async (req, res) => {
  // 클라이언트가 보낸 요청에서 사용자명(username)과 비밀번호(password)를 추출합니다.
  const { username, password } = req.body;

  try {
    // 데이터베이스에서 해당 사용자 정보 가져오기
    pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Login failed.' });
        } else if (result.length === 0) {
          res.status(404).json({ message: 'User not found.' });
        } else {
          const user = result[0];

          // 비밀번호 해시화 비교
          const isPasswordMatched = await bcrypt.compare(password, user.password);

          if (isPasswordMatched) {
            // 로그인 성공 시 세션에 사용자 정보 저장
            req.session.user = user;

            // 로그인 성공 시 대시보드 페이지로 리다이렉트
res.status(200).json({ message: 'Login successful!' });
          } else {
            res.status(401).json({ message: 'Invalid password.' });
          }
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed.' });
  }
});

// 라우트: 회원가입 요청 처리
app.post('/signup', async (req, res) => {
  // 클라이언트가 보낸 요청에서 사용자명(username)과 비밀번호(password)를 추출합니다.
  const { username, password } = req.body;

  try {
    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 정보 데이터베이스에 저장
    pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Signup failed.' });
        } else {
          res.status(201).json({ message: 'Signup successful!' });
        }
}
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed.' });
  }
});

// 라우트: 대시보드 페이지 (인증 필요)
app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// 라우트: 로그아웃 처리
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('세션 파기 오류:', err);
    }
    res.redirect('/login');
  });
});

// 미들웨어: 사용자 인증 체크
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
