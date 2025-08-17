// Video transcripts data for Sage AI summarization
export const videoTranscripts = {
  // Cyber Security Course Transcripts
  'course1-wk1-vid0001': {
    title: 'Identification of Endpoint-Centric Attacks',
    transcript: `Welcome to Week 1 of our Cybersecurity course. Today we'll be covering the fundamental principles that form the backbone of information security. Cybersecurity is not just about protecting computers; it's about safeguarding our digital way of life.

Let's start with the CIA triad - Confidentiality, Integrity, and Availability. These three principles are the foundation of information security. Confidentiality ensures that information is accessible only to those authorized to have access. Integrity maintains and assures the accuracy and completeness of data. Availability ensures that authorized users have access to information when needed.

We'll also explore the different types of cyber threats that organizations face today. From malware and phishing attacks to advanced persistent threats and insider threats, understanding these risks is crucial for developing effective defense strategies.

The threat landscape is constantly evolving, with attackers becoming more sophisticated and organized. We'll examine recent high-profile cyber attacks and analyze what went wrong and how they could have been prevented.

Finally, we'll discuss the importance of a comprehensive security framework that includes technical controls, administrative controls, and physical controls. Remember, cybersecurity is not a one-time effort but a continuous process of assessment, implementation, and improvement.`,
    summary: `In this first session of the Cisco CyberOps Associate track, Identification of Endpoint-Centric Attacks, you'll learn why security monitoring is essential in protecting modern networks and devices. With the huge amount of data generated daily, some of it can help detect and solve security problems, while some can be exploited by attackers if not safeguarded. This course will teach you how to use telemetry sources, understand different types of critical cybersecurity data, identify attack surfaces on networks and endpoints, and recognize attacker evasion tactics while learning how to counter them. You'll gain hands-on experience working with real datasets and SIEM tools like Splunk to collect and analyze logs, using resources provided in the course files. As part of the Cisco CyberOps certification path, these skills will prepare you for the CyberOps Associate exam and real-world roles in cybersecurity operations. By the end, you'll be ready to protect all endpoints through antivirus, endpoint detection and response (EDR), and a Zero Trust security model, while proactively monitoring to reduce attack surfaces and strengthen overall security posture.`
  },
  'course1-wk2-vid0002': {
    title: 'Endpoint Security and Attack Surfaces',
    transcript: `In today's session, we'll dive deep into network security and the critical role that firewalls play in protecting our digital infrastructure. Network security is the practice of securing a computer network from intruders, whether targeted attackers or opportunistic malware.

Let's begin with understanding how networks are structured and where vulnerabilities commonly exist. Networks are complex systems with multiple entry points, and each connection represents a potential security risk. We'll examine the OSI model and identify security considerations at each layer.

Firewalls are our first line of defense. We'll explore different types of firewalls: packet-filtering firewalls, stateful inspection firewalls, application-level gateways, and next-generation firewalls. Each type has its strengths and limitations, and understanding these differences is crucial for effective network defense.

We'll also discuss intrusion detection and prevention systems, or IDS/IPS. These systems monitor network traffic for suspicious activity and can either alert administrators or automatically take action to block threats.

Virtual Private Networks, or VPNs, are essential for secure remote access. We'll examine how VPNs work, the different protocols used, and best practices for implementation.

Finally, we'll look at network segmentation strategies and how dividing networks into smaller, more manageable segments can improve security and reduce the impact of potential breaches.`,
    summary: `Endpoints are devices such as laptops, smartphones, desktops, IoT gadgets, and servers that connect to networks. They are attractive targets for attackers because they store valuable data or provide access to corporate systems. Since endpoints are used everywhere, they collectively create a large attack surface for potential cyberattacks.

A vulnerability is a flaw—like outdated software—that attackers can exploit. The attack surface refers to all the possible entry points an attacker could use. Even if most devices are secure, a few unprotected ones can become the active attack surface. The goal of endpoint security is to reduce that surface as much as possible.

Some endpoints, like Windows domain controllers, network management servers, executive laptops, and database systems, are especially critical because they control or store sensitive information. These require stronger defenses, tighter access controls, and continuous monitoring.

Securing endpoints involves identifying high-risk devices and maintaining an up-to-date inventory. Firewalls and access restrictions help limit unauthorized entry, while telemetry data allows for constant monitoring. Regular software updates and security patches are essential to close vulnerabilities quickly.

A holistic approach goes beyond securing individual devices. It includes using antivirus and Endpoint Detection and Response (EDR) tools, implementing zero-trust policies to verify every device and user, and using Security Information and Event Management (SIEM) systems for continuous oversight. By protecting all endpoints, not just the critical ones, organizations can shrink their attack surface and create a much safer environment.`
  },
  'course1-wk3-vid0003': {
    title: 'Endpoint Security Technologies and Layered Defense',
    transcript: `Today we're exploring the fascinating world of cryptography, the science of securing information through mathematical techniques. Cryptography is essential for protecting data in transit and at rest, ensuring that only authorized parties can access sensitive information.

Let's start with the basics of cryptographic algorithms. We'll examine symmetric encryption, where the same key is used for both encryption and decryption. Popular symmetric algorithms include AES, DES, and 3DES. We'll discuss their strengths, weaknesses, and appropriate use cases.

Asymmetric encryption, also known as public-key cryptography, uses different keys for encryption and decryption. This revolutionary approach enables secure communication without pre-shared secrets. We'll explore RSA, ECC, and other asymmetric algorithms.

Hash functions are crucial for data integrity and digital signatures. We'll examine SHA-256, MD5, and other hash functions, understanding their properties and applications in cybersecurity.

Digital certificates and Public Key Infrastructure, or PKI, form the foundation of secure web communication. We'll discuss how SSL/TLS protocols work and how certificates are issued, validated, and revoked.

Finally, we'll explore emerging cryptographic technologies like quantum-resistant algorithms and homomorphic encryption, which may shape the future of cybersecurity.`,
    summary: `Endpoint security is essential because devices like laptops, mobile phones, and servers are common targets for cyberattacks. Protecting these devices requires a layered approach using several technologies that work together to detect, block, and respond to threats. Host-based protections form the first line of defense. A host-based firewall filters traffic entering or leaving the device based on predefined rules, while host-based intrusion detection and prevention systems (IDS/IPS) monitor for suspicious activity and can block harmful actions. Application allow- and block-listing ensures only authorized programs can run, stopping unapproved or malicious software.

Advanced techniques add stronger protection. Sandboxing allows files to be tested in an isolated environment before they run, helping detect unknown threats without risking the system. Antivirus and anti-malware tools remain important, especially when enhanced with heuristics, behavioral analysis, and real-time threat intelligence. Endpoint Detection and Response (EDR) solutions, like Cisco Secure Endpoint, go even further by providing constant monitoring, USB device control, retrospective analysis, and integrated threat protection.

Visibility and policy enforcement are also critical. Logs and event records capture detailed information about device activity, which is invaluable for investigations. Network visibility tools track data flow, processes, and user behavior. For mobile and remote devices, roaming protection tools—such as DNS security, compliance checks, and Mobile Device Management (MDM)—help ensure devices meet security requirements before accessing company resources.

In summary, endpoint security is not optional—it's a vital component of defending against evolving cyber threats. Combining firewalls, IDS/IPS, sandboxing, anti-malware, EDR, logging, and mobile device security creates a multi-layered defense that significantly reduces risks across an organization's devices.`
  },
  'course1-wk4-vid0004': {
    title: 'Introduction to Endpoint Security Mechanisms',
    transcript: `In our final week, we'll focus on what happens when security measures fail - incident response and digital forensics. Despite our best efforts, security incidents are inevitable, and how we respond can make the difference between a minor disruption and a catastrophic breach.

Let's begin with incident response planning. Every organization needs a comprehensive incident response plan that outlines roles, responsibilities, and procedures for handling security incidents. We'll examine the six phases of incident response: preparation, identification, containment, eradication, recovery, and lessons learned.

Digital forensics is the scientific examination and analysis of digital evidence. We'll explore the forensic process, from evidence collection and preservation to analysis and reporting. Understanding forensic principles is crucial for both incident response and legal proceedings.

We'll discuss different types of digital evidence, including volatile data from memory, persistent data from storage devices, and network traffic logs. Each type requires different collection and preservation techniques.

Chain of custody is critical in digital forensics. We'll examine how to maintain proper documentation and ensure that evidence remains admissible in court.

Finally, we'll look at post-incident activities, including root cause analysis, security improvements, and communication strategies. Learning from incidents is essential for improving our security posture and preventing future breaches.`,
    summary: `Endpoint security is a critical part of modern cybersecurity because devices like laptops, desktops, servers, smartphones, IoT gadgets, and even smartwatches are everywhere—in homes, workplaces, and daily life. These endpoints have existed longer than modern networks, making them long-standing and common targets for cyberattacks. With so many device types, each with unique security needs, protecting them is complex and requires a tailored approach. This course, Introduction to Endpoint Security Mechanisms, will give you a solid understanding of endpoint security technologies, their role in securing hosts, and the unique challenges of protecting diverse devices. You'll explore operating system security components, analyze endpoint telemetry, learn forensic imaging techniques, and understand the basics of malware analysis and email security best practices. Hands-on activities using SIEM tools like Splunk will give you real-world practice in detecting and managing threats. As part of the Cisco CyberOps Associate learning path, this course builds on earlier modules and prepares you not just for certification exams but also for real-world cybersecurity operations.`
  },

  // Advanced Python Course Transcripts
  'course2-wk1-vid0001': {
    title: 'Python Data Structures Fundamentals',
    transcript: `Welcome to Advanced Python Programming. In this first week, we'll explore sophisticated data structures and algorithms that go beyond the basics. Python's flexibility and rich ecosystem make it an excellent language for implementing complex data structures.

Let's start with advanced list comprehensions and generator expressions. These powerful features allow us to create efficient, memory-friendly data processing pipelines. We'll examine how generators can handle large datasets without loading everything into memory.

Next, we'll dive into custom data structures. We'll implement our own linked lists, binary trees, and graphs using Python classes. Understanding how these structures work internally helps us choose the right tool for each problem.

We'll explore Python's built-in collections module, including defaultdict, Counter, and deque. These specialized data structures provide optimized solutions for common programming problems.

Algorithm analysis is crucial for writing efficient code. We'll discuss Big O notation and how to analyze the time and space complexity of our algorithms. We'll implement and compare different sorting algorithms, from bubble sort to quicksort.

Finally, we'll examine Python's memory management and how it affects our choice of data structures. Understanding garbage collection and object lifecycle helps us write more efficient and reliable code.`,
    summary: `In this course, we'll explore one of the most important foundations of Python—data structures. These are built-in tools that allow us to store, access, and manipulate data effectively, and they're essential for any kind of programming, from building websites to working with data and machine learning.

We'll focus on four key structures: lists, which hold ordered and changeable collections of items; tuples, which store data that shouldn't be changed; sets, which help with logic-based operations like unions and intersections; and dictionaries, which store data as key-value pairs for quick access. Each has its own strengths, and learning when and how to use them will help you write cleaner, faster, and more efficient code.

Before starting, you should already know basic Python syntax and feel comfortable using a Python environment such as Jupyter Notebook or an IDE. With these skills, you'll be ready to strengthen your Python foundation and confidently tackle real-world problems.`
  },
  'course2-wk2-vid0002': {
    title: 'Object-Oriented Programming and Design Patterns',
    transcript: `Today we'll explore advanced object-oriented programming concepts and design patterns in Python. OOP is not just about creating classes; it's about designing maintainable, extensible, and reusable code.

Let's begin with advanced OOP concepts. We'll examine abstract base classes, which define interfaces that subclasses must implement. This is crucial for creating robust, extensible systems. We'll also explore metaclasses, which allow us to customize class creation itself.

Inheritance and composition are fundamental to OOP design. We'll discuss when to use each approach and how to avoid common pitfalls like the diamond problem. We'll examine the principle of composition over inheritance and how it leads to more flexible designs.

Design patterns are proven solutions to common programming problems. We'll implement several creational patterns like Singleton, Factory, and Builder. We'll also explore structural patterns like Adapter, Decorator, and Facade.

Behavioral patterns help us manage object communication and state. We'll examine Observer, Strategy, and Command patterns, implementing each in Python and discussing their trade-offs.

Finally, we'll discuss SOLID principles and how they guide good OOP design. These principles help us create code that is easy to understand, test, and maintain.`,
    summary: `This lecture covers advanced OOP concepts including abstract base classes and metaclasses, inheritance vs composition principles, design patterns (creational, structural, behavioral), SOLID principles, and best practices for maintainable object-oriented code.`
  },
  'course2-wk3-vid0003': {
    title: 'Python Lists: Fundamentals and Operations',
    transcript: `In today's session, we'll explore concurrency and asynchronous programming in Python. Modern applications need to handle multiple tasks efficiently, and Python provides several approaches for concurrent execution.

Let's start with threading and multiprocessing. We'll examine when to use threads versus processes and how Python's Global Interpreter Lock affects concurrent execution. We'll implement thread-safe data structures and explore synchronization primitives like locks, semaphores, and condition variables.

Asynchronous programming with asyncio is Python's modern approach to concurrency. We'll explore coroutines, async/await syntax, and how to structure asynchronous applications. We'll examine event loops and how they manage concurrent tasks.

We'll implement practical examples including web scraping, API calls, and file processing using asynchronous techniques. We'll discuss error handling in concurrent code and how to properly manage resources.

Concurrent data structures are essential for thread-safe applications. We'll examine queues, pipes, and shared memory, implementing examples that demonstrate their use cases.

Finally, we'll discuss performance profiling and debugging concurrent code. We'll use tools like cProfile and threading to identify bottlenecks and ensure our concurrent code is both correct and efficient.`,
    summary: `In Python, a list is a data structure that allows you to store multiple values in a single variable. You create a list using square brackets, with each value separated by commas. Each value inside the list is called an element. Lists can hold different data types such as strings, integers, floats, and even other lists (nested lists). While Python supports mixed data types in a list, it's generally best practice to keep the data type consistent for clarity and ease of use.

Lists have two important characteristics: they are ordered and mutable. Being ordered means that the position of each element is fixed and predictable, allowing you to access them by index. Being mutable means you can change their contents at any time—whether by updating existing values, adding new ones, or removing elements. This flexibility makes lists a powerful and versatile tool in Python programming.

Because of their ability to store and organize related data efficiently, lists are widely used in Python. You can experiment with lists by creating them, changing values, adding new elements, and checking their length. Practicing these operations is the best way to become comfortable working with lists and to understand why they are such an essential part of Python. In upcoming lessons, you'll learn more about adding, removing, and updating list elements using Python's built-in tools.`
  },
  'course2-wk4-vid0004': {
    title: 'Python in Data Science: Ecosystem and Applications',
    transcript: `In our final week, we'll focus on writing reliable, maintainable code through comprehensive testing, effective debugging, and performance optimization. These skills are essential for professional Python development.

Let's begin with testing strategies. We'll explore unit testing with pytest, including fixtures, parametrization, and mocking. We'll discuss test-driven development and how writing tests first leads to better code design.

Integration testing ensures that components work together correctly. We'll examine how to test database interactions, API calls, and external service integrations. We'll also explore property-based testing for finding edge cases.

Debugging is an essential skill. We'll use Python's built-in debugger, pdb, and explore advanced debugging techniques. We'll examine logging strategies and how to create effective error messages.

Performance optimization requires understanding Python's execution model. We'll profile code using cProfile and line_profiler, identifying bottlenecks and optimizing critical sections. We'll explore techniques like caching, lazy evaluation, and algorithm optimization.

Finally, we'll discuss code quality tools like flake8, black, and mypy. These tools help maintain consistent, readable code and catch potential errors before they become problems.`,
    summary: `Python is a powerful, open-source programming language widely used across industries for tasks ranging from building applications to automating workflows and driving machine learning. Its clear, beginner-friendly syntax and cross-platform compatibility make it an excellent choice for both newcomers and experienced developers. In the world of data science, Python stands out for its rich library ecosystem, strong global community, and the ability to handle everything from basic scripting to advanced analytics.

At its core, Python supports object-oriented programming, meaning everything in Python is treated as an object. As an interpreted language, it executes code line by line, making debugging more straightforward. Its portability ensures that the same code can run seamlessly on Windows, macOS, and Linux without modification.

Python's strength in data science comes from its specialized libraries. NumPy powers numerical computing, Pandas streamlines data manipulation, Matplotlib creates meaningful visualizations, and SciPy handles advanced scientific computations. Together, these tools provide a complete ecosystem for effective data handling and analysis. With a solid foundation in Python, you are well-equipped to explore and master advanced techniques in your data journey.`
  }
};

// Helper function to get transcript by video URL
export const getTranscriptByVideoUrl = (videoUrl) => {
  // Extract video identifier from URL
  const urlParts = videoUrl.split('/');
  const videoFileName = urlParts[urlParts.length - 1];
  const videoId = videoFileName.split('?')[0]; // Remove query parameters
  const videoIdWithoutExtension = videoId.replace('.mp4', ''); // Remove .mp4 extension
  
  // Debug logging
  console.log('Video URL:', videoUrl);
  console.log('Extracted video ID:', videoId);
  console.log('Video ID without extension:', videoIdWithoutExtension);
  console.log('Available transcripts:', Object.keys(videoTranscripts));
  
  return videoTranscripts[videoIdWithoutExtension] || null;
};

// Helper function to get transcript by course and week
export const getTranscriptByCourseAndWeek = (courseName, week) => {
  const coursePrefix = courseName === 'Cyber Security' ? 'course1' : 'course2';
  const videoId = `${coursePrefix}-wk${week}-vid${week.toString().padStart(4, '0')}`;
  
  return videoTranscripts[videoId] || null;
};
