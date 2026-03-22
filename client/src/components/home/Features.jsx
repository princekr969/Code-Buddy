import React from 'react';
import { motion } from "framer-motion"
import { Code2, Users, Terminal, MessageSquare, FolderKanban, Zap, ChevronRight} from "lucide-react"
import { Card, CardContent } from "../ui/Card"
import Tilt from 'react-parallax-tilt';


const features = [
  {
    title: "Collaborative Editing",
    description: "Code together in real-time with multiple developers on the same file.",
    icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Code Execution",
    description: "Run your code directly in the browser with instant feedback.",
    icon: <Terminal className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Integrated Chat",
    description: "Communicate with your team without leaving the editor.",
    icon: <MessageSquare className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "File Management",
    description: "Organize your projects with our intuitive file system.",
    icon: <FolderKanban className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Multi-Language Support",
    description: "Code in JavaScript, Python, Java, C++, C, C# and many more.",
    icon: <Code2 className="h-6 w-6 md:h-8 md:w-8" />,
  },
  {
    title: "Lightning Fast",
    description: "Optimized performance for a smooth coding experience.",
    icon: <Zap className="h-6 w-6 md:h-8 md:w-8" />,
  },
]

function Features() {
  return (
    <div>
      <section className="py-16 sm:py-12 md:py-16 bg-slate-950">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              
              
              <motion.h2
                className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 sm:mb-4 px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Everything you need to succeed
              </motion.h2>
              
              <motion.p
                className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto px-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Powerful features designed for modern development teams
              </motion.p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {features.map((feature, index) => (
                <Tilt key={index} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card className="h-full bg-gray-800/50 border border-gray-700 transition-all duration-300">
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gray-700 flex items-center justify-center mb-3 sm:mb-4 text-purple-400">
                          {feature.icon}
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 text-white">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-gray-400">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
    </div>
  )
}

export default Features
