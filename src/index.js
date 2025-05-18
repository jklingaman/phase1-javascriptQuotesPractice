
function buildQuoteCard(input) {
    const div = document.createElement('div')
    const quoteList = document.querySelector('#quote-list');

    div.style.paddingBottom = '20px';
    div.classList = 'quoteCard';

    div.innerHTML = `
        <li class='quote-card'>
        <blockquote class='blockquote'>
        <p class='mb-0'>${input.quote}</p>
        <footer class='blockquote-footer'>${input.author}</footer>
        <br>
        <button class='btn-success'  data-id='${input.id}'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
        </blockquote>
        </li>
    `

    quoteList.appendChild(div);

    // note that this is div.quereySelector not document.
    const likeBtn = div.querySelector('.btn-success');

    likeBtn.addEventListener('click', () => {
        const seconds = Math.floor(Date.now() / 1000);

        fetch('http://localhost:3000/likes', {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                quoteId: input.id,
                createdAt: seconds
            })
        })
        .then((res) => res.json())
        .then(() => {
            const span = likeBtn.querySelector('span');

            const spanValue = span.innerText;

            const parsed = parseInt(spanValue);

            const newNumber = parsed + 1;

           span.innerText = newNumber;
        })
    })

    const deleteBtn = div.querySelector('.btn-danger');

    deleteBtn.addEventListener('click', () => {
        fetch(`http://localhost:3000/quotes/${input.id}`, {
        'method': 'DELETE'
        })
        .then((res) => {
            if (res.ok) {
                div.remove();
            }
            if (!res.ok) {
                throw new console.error(`Repsonse status: ${res.status}`);
                
            }
        })
    })
}

function fetchLikes() {
    fetch('http://localhost:3000/likes')
    .then((res) => res.json())
    .then((data) => {
        let currentCount = {};
        const likeBtn = document.querySelectorAll('.btn-success');

        for(const Likes of data) {
            const quoteId = Likes.quoteId;

            if (currentCount[quoteId]) {
                currentCount[quoteId] += 1;
            } else {
                currentCount[quoteId] = 1;
            }
        }

            for (const like of likeBtn) {
                const quoteId = like.dataset.id;

                const likeSpan = like.querySelector('span');

                likeSpan.textContent = currentCount[quoteId] || 0;
            }
    })
}

function fetchQuotes() {
    fetch('http://localhost:3000/quotes')
    .then((res) => res.json())
    .then((quotes) => quotes.forEach((quote) => {
        buildQuoteCard(quote)
    }))
    fetchLikes()
    formSubmit()
}

function formSubmit() {
    const form = document.querySelector('form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const newQuote = form.querySelector(`input[id = 'new-quote']`);

        const author = form.querySelector(`input[id = 'author']`);

        fetch('http://localhost:3000/quotes', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({
            quote: newQuote.value,
            author: author.value
        })
        })
        .then((res) => res.json())
        .then((data) => {
            buildQuoteCard(data);

            newQuote.value = '';
            author.value = '';

        })
    })
}

function init() {
    fetchQuotes()
}

document.addEventListener('DOMContentLoaded', () => init())