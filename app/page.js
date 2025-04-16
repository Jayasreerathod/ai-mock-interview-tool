"use client"

import { Button } from "../components/ui/button"
import Link from "next/link"

export default function Home() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-6 py-12'>
			{/* Hero Section */}
			<section className='text-center max-w-4xl'>
				<h1 className='text-5xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 leading-tight mb-6 drop-shadow-md'>
					Crack Interviews with{" "}
					<span className='text-indigo-600'>Confidence</span>
				</h1>

				<p className='text-lg text-zinc-600 mb-10 max-w-2xl mx-auto'>
					Get better with every question. Practice mock interviews powered by
					AI, receive insightful feedback, and grow your skills like a pro.
				</p>

				<Link href='/dashboard'>
					<Button className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-md mb-20 rounded-full shadow-lg transition duration-300'>
						Start Practicing
					</Button>
				</Link>
			</section>

			{/* How it Works */}
			<section className='w-full max-w-6xl'>
				<h2 className='text-4xl font-bold text-center text-zinc-800 mb-16'>
					How It Works
				</h2>

				<div className='grid md:grid-cols-4 sm:grid-cols-2 gap-8 px-4'>
					{[
						{
							title: "Choose a Topic",
							desc: "From DSA to React, select an interview category. Every question is tailored to challenge and prepare you.",
						},
						{
							title: "Record Your Answer",
							desc: "Use text or voice to respond. We'll recreate a real interview setting — time constraints and all.",
						},
						{
							title: "Get AI Feedback",
							desc: "Our smart AI reviews your answers, suggests improvements, and scores your performance.",
						},
						{
							title: "Track Your Growth",
							desc: "Check progress over time. See your scores, revisit past interviews, and improve continuously.",
						},
					].map((step, idx) => (
						<div
							key={idx}
							className='bg-white/70 backdrop-blur-lg rounded-2xl border border-zinc-100 p-6 shadow-lg hover:shadow-xl transition duration-300'
						>
							<div className='text-sm text-indigo-500 font-semibold mb-2 tracking-wide uppercase'>
								Step {idx + 1}
							</div>
							<h3 className='text-xl font-semibold text-zinc-800 mb-2'>
								{step.title}
							</h3>
							<p className='text-sm text-zinc-600 leading-relaxed'>
								{step.desc}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Footer CTA */}
			<section className='text-center mt-24'>
				<p className='text-zinc-500 mb-4 text-md italic'>Ready to level up?</p>
				<Link href='/dashboard'>
					<Button className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-md shadow-lg rounded-full transition-all'>
						Let’s Begin
					</Button>
				</Link>
			</section>
		</div>
	)
}