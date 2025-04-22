import React from 'react'

function Home() {
    return (
        <section className="bg-indigo-100">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Vote for Change,
                        <strong className="font-extrabold text-indigo-700 sm:block">Vote for Progress! </strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        A secure, transparent, and user-friendly online voting platform. Cast your vote with confidence!
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <a
                            className="block w-full rounded-sm bg-indigo-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-3 focus:outline-hidden sm:w-auto"
                            href="./election"
                        >
                            Get Started
                        </a>


                    </div>
                </div>
            </div>
        </section>
    )
}

export default Home