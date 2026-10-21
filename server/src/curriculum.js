const path = require('node:path');
const fs = require('node:fs');

const documentsDir = path.resolve(__dirname, '../../documentss');

const curriculumList = [
  // Module 1: Java Foundations & Primitives
  {
    id: 'doc-01',
    sequence: 1,
    title: 'Java Architecture & First Program',
    filename: 'Java Lesson1 (1).pptx',
    module: 'Foundations & Primitives',
    format: 'PPTX',
    estimatedMinutes: 20,
    description: [
      'Introduces JVM, JRE, and JDK architecture and how bytecode executes across platforms.',
      'Guides you through writing, compiling, and running your first Java console application.',
      'Covers main method structure, package declarations, and standard console output syntax.',
      'Crucial starting foundation to understand how source code transforms into executable bytecode.'
    ]
  },
  {
    id: 'doc-02',
    sequence: 2,
    title: 'Primitive Data Types & Memory Allocation',
    filename: 'Section2_Primitive+data+types+in+Java_Images (1).pdf',
    module: 'Foundations & Primitives',
    format: 'PDF',
    estimatedMinutes: 25,
    description: [
      'Detailed breakdown of Java\'s 8 primitive data types including byte, int, float, and boolean.',
      'Explains memory allocations, bit depths, valid ranges, and numeric literal suffixes.',
      'Covers automatic type widening, explicit casting rules, and precision loss pitfalls.',
      'Essential for mastering arithmetic constraints and scanner inputs in exam problems.'
    ]
  },
  {
    id: 'doc-03',
    sequence: 3,
    title: 'Strings, Immutability & Memory Pool',
    filename: 'Section6_Deep+dive+on+String+in+Java.pdf',
    module: 'Foundations & Primitives',
    format: 'PDF',
    estimatedMinutes: 35,
    description: [
      'Deep dive into String immutability and the internal workings of the String Constant Pool.',
      'Details core String methods including substring, charAt, indexOf, split, and replace.',
      'Analyzes performance differences between immutable String, StringBuilder, and StringBuffer.',
      'Critical for solving String portal questions (questions java-001 through java-005).'
    ]
  },

  // Module 2: Object-Oriented Programming (OOP)
  {
    id: 'doc-04',
    sequence: 4,
    title: 'Class Inheritance & Polymorphism',
    filename: 'Section10_Inheritance+in+Java.pdf',
    module: 'OOP & Class Design',
    format: 'PDF',
    estimatedMinutes: 35,
    description: [
      'Explores the extends keyword, code reusability, and parent-child class hierarchies.',
      'Teaches method overriding rules, runtime polymorphism, and the @Override annotation.',
      'Differentiates between IS-A inheritance relationships and HAS-A composition models.',
      'Essential for portal problems requiring base and derived employee/account models.'
    ]
  },
  {
    id: 'doc-05',
    sequence: 5,
    title: 'Super Constructor Chaining & State Initialization',
    filename: 'Super constructor.pptx',
    module: 'OOP & Class Design',
    format: 'PPTX',
    estimatedMinutes: 20,
    description: [
      'Focuses on constructor execution order from top-level superclasses down to derived classes.',
      'Details explicit super() invocations, parameterized chaining, and placement restrictions.',
      'Explains variable shadowing resolution using super.variable versus this.variable.',
      'Crucial for lab exams where base class state must be initialized before derived logic.'
    ]
  },
  {
    id: 'doc-06',
    sequence: 6,
    title: 'Interfaces & Multiple Contract Inheritance',
    filename: 'Section11_Interfaces+in+Java (1).pdf',
    module: 'OOP & Class Design',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Thorough exploration of Java interface contracts, abstract methods, and public static final fields.',
      'Explains how Java achieves multiple inheritance through multiple interface implementations.',
      'Introduces modern interface capabilities including default methods and static utility methods.',
      'Provides the conceptual foundation for loose coupling and standard Java API designs.'
    ]
  },
  {
    id: 'doc-07',
    sequence: 7,
    title: 'Applied Interface Architecture & Decoupling',
    filename: 'Java+Interface (2).pptx',
    module: 'OOP & Class Design',
    format: 'PPTX',
    estimatedMinutes: 20,
    description: [
      'Practical design slide deck demonstrating real-world interface usage and architectural abstraction.',
      'Illustrates polymorphism where interface references hold various concrete implementation instances.',
      'Demonstrates separation of API contract from implementation details in enterprise systems.',
      'Reinforces clean code habits tested in software engineering lab scenarios.'
    ]
  },

  // Module 3: Arrays & Object Arrays
  {
    id: 'doc-08',
    sequence: 8,
    title: 'Single & Multi-Dimensional Arrays',
    filename: 'Section12_Arrays+in+Java.pdf',
    module: 'Arrays & Object References',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Covers 1D and 2D array declarations, dynamic memory allocation, and zero-based indexing.',
      'Teaches nested loop traversals, matrix row-column mappings, and boundary validations.',
      'Explores common edge cases including ArrayIndexOutOfBoundsException and jagged arrays.',
      'Directly applies to matrix rotation, multiplication, and sorting exam challenges.'
    ]
  },
  {
    id: 'doc-09',
    sequence: 9,
    title: 'Array of Custom Objects & Heap References',
    filename: 'Array of Object.pdf',
    module: 'Arrays & Object References',
    format: 'PDF',
    estimatedMinutes: 20,
    description: [
      'Explains how reference arrays store pointers rather than actual object memory in the heap.',
      'Demonstrates two-step instantiation: creating the array container then instantiating each item.',
      'Highlights common NullPointerException hazards when iterating uninitialized elements.',
      'Bridges foundational arrays with real-world entity modeling and collection classes.'
    ]
  },

  // Module 4: Exception Handling & Robust Systems
  {
    id: 'doc-10',
    sequence: 10,
    title: 'Try, Catch, Finally & Exception Hierarchy',
    filename: 'Java Exception Handling.pdf',
    module: 'Exception Handling',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Comprehensive walkthrough of Throwable, Exception, RuntimeException, and Error hierarchies.',
      'Teaches try-catch block mechanics, exception matching order, and the guaranteed finally block.',
      'Clarifies differences between checked (compile-time) and unchecked (runtime) exceptions.',
      'Foundational for writing fail-safe programs that do not crash on unexpected inputs.'
    ]
  },
  {
    id: 'doc-11',
    sequence: 11,
    title: 'Throw, Throws & Multi-Catch Blocks',
    filename: 'Java Exception Handling part  2.pdf',
    module: 'Exception Handling',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Explains how to explicitly trigger exceptions with throw and propagate them with throws.',
      'Demonstrates modern multi-catch blocks to handle distinct exception types compactly.',
      'Covers try-with-resources syntax for automatic stream and connection cleanup without leaks.',
      'Vital for passing test cases that verify precise exception propagation and error messages.'
    ]
  },
  {
    id: 'doc-12',
    sequence: 12,
    title: 'Custom Domain Exceptions Implementation',
    filename: 'Example Program for using Custom Exception.docx',
    module: 'Exception Handling',
    format: 'DOCX',
    estimatedMinutes: 15,
    description: [
      'Code-centric guide to creating custom domain exception classes by extending Exception.',
      'Demonstrates constructor overloading to pass descriptive error messages to the superclass.',
      'Includes concrete validation examples checking numerical boundaries and domain constraints.',
      'Directly matches portal problems java-023 and java-024 requiring custom validation exceptions.'
    ]
  },

  // Module 5: File I/O & Stream Processing
  {
    id: 'doc-13',
    sequence: 13,
    title: 'File System Operations & File Class',
    filename: 'Files.pptx',
    module: 'File I/O & Streams',
    format: 'PPTX',
    estimatedMinutes: 20,
    description: [
      'Introduces java.io.File concepts, filesystem paths, and platform directory separators.',
      'Demonstrates checking file existence, length, read/write permissions, and metadata.',
      'Covers file and directory creation, file deletion, and directory tree listings.',
      'First step in file handling required before reading and writing stream contents.'
    ]
  },
  {
    id: 'doc-14',
    sequence: 14,
    title: 'Byte & Character Streams (I/O Pipelines)',
    filename: 'Streams_Files (1).pptx',
    module: 'File I/O & Streams',
    format: 'PPTX',
    estimatedMinutes: 30,
    description: [
      'Deep dive into Byte Streams (FileInputStream/FileOutputStream) for raw binary and images.',
      'Covers Character Streams (FileReader/FileWriter) and character encodings for text files.',
      'Demonstrates buffering with BufferedReader and BufferedWriter for optimal I/O throughput.',
      'Directly enables solving lab questions java-018 through java-022 (file counting and binary copy).'
    ]
  },

  // Module 6: Collections - Lists & Sequences
  {
    id: 'doc-15',
    sequence: 15,
    title: 'List Interface & ArrayList Dynamic Arrays',
    filename: 'Section17_Lists+and+ArrayLists+Unleashed+–+A+Hilarious+Journey+through+Data+Structures.pdf',
    module: 'Collections - Lists & Sequences',
    format: 'PDF',
    estimatedMinutes: 35,
    description: [
      'Engaging deep dive into the List interface and dynamic backing arrays in ArrayList.',
      'Explains capacity expansion formulas, random access speeds, and index-based insertions.',
      'Teaches iterator usage, for-each traversal, and avoiding ConcurrentModificationException.',
      'The most frequently tested collection class across competitive and portal exams.'
    ]
  },
  {
    id: 'doc-16',
    sequence: 16,
    title: 'ArrayList with Custom Entity Classes (CRUD)',
    filename: 'ArrayList program for Student Class.docx',
    module: 'Collections - Lists & Sequences',
    format: 'DOCX',
    estimatedMinutes: 15,
    description: [
      'Complete hands-on code implementation storing custom Student objects inside an ArrayList.',
      'Demonstrates adding, updating, searching, and removing elements using object properties.',
      'Explains overriding toString() and equals() to enable clean printing and searching.',
      'Replicates common lab exam scenarios requiring CRUD operations on domain entities.'
    ]
  },
  {
    id: 'doc-17',
    sequence: 17,
    title: 'LinkedList Internals & Doubly-Linked Nodes',
    filename: "Section18_LinkedLists+-+Java's+Dance+of+Nodes.pdf",
    module: 'Collections - Lists & Sequences',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Visual breakdown of doubly-linked list nodes with prev, data, and next reference pointers.',
      'Compares O(1) head/tail insertions against ArrayList O(n) array-shifting penalties.',
      'Explains trade-offs between sequential traversal overhead and dynamic node allocations.',
      'Directly relevant for understanding linked list interview problems and queue implementations.'
    ]
  },
  {
    id: 'doc-18',
    sequence: 18,
    title: 'Vectors & Thread-Safe Legacy Collections',
    filename: 'Vectors.pptx',
    module: 'Collections - Lists & Sequences',
    format: 'PPTX',
    estimatedMinutes: 20,
    description: [
      'Examines Java\'s historical Vector class and its synchronized method thread-safety model.',
      'Highlights performance differences between synchronized Vectors and non-synchronized ArrayLists.',
      'Demonstrates capacity doubling strategies and legacy Enumeration traversal mechanisms.',
      'Frequently appears on multiple-choice theory exams contrasting legacy versus modern collections.'
    ]
  },
  {
    id: 'doc-19',
    sequence: 19,
    title: 'Stacks, Queues & Double-Ended Deques',
    filename: 'stack_queue_deque.ppt',
    module: 'Collections - Lists & Sequences',
    format: 'PPT',
    estimatedMinutes: 25,
    description: [
      'Illustrates Last-In-First-Out (LIFO) Stack operations: push, pop, and peek.',
      'Explains First-In-First-Out (FIFO) Queue behaviors with offer, poll, and element methods.',
      'Introduces the ArrayDeque class as a faster, modern replacement for both Stack and LinkedList.',
      'Foundational for algorithmic problem solving, balanced bracket checking, and sliding windows.'
    ]
  },

  // Module 7: Generics & Type Parameters
  {
    id: 'doc-20',
    sequence: 20,
    title: 'Generics Fundamentals & Type Safety',
    filename: 'Section19_Generics+in+Java.pdf',
    module: 'Generics & Type Parameters',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Explains how generic type parameters <T, E, K, V> provide compile-time type safety.',
      'Demonstrates generic class and method syntax while eliminating manual typecasting.',
      'Explores type erasure mechanics and how bytecode retains backwards compatibility.',
      'Essential prerequisite for understanding modern Java Collection Framework data structures.'
    ]
  },
  {
    id: 'doc-21',
    sequence: 21,
    title: 'Bounded Type Parameters & Wildcards',
    filename: 'Generics.pptx',
    module: 'Generics & Type Parameters',
    format: 'PPTX',
    estimatedMinutes: 20,
    description: [
      'Covers advanced generics including upper bounded wildcards <? extends Number>.',
      'Explains lower bounded wildcards <? super Integer> and the PECS design principle.',
      'Demonstrates generic interfaces and constraints when writing reusable library algorithms.',
      'Crucial for advanced university Java exams testing polymorphic generic collections.'
    ]
  },

  // Module 8: Maps, Sets & Sorting
  {
    id: 'doc-22',
    sequence: 22,
    title: 'Map Architecture: HashMaps, TreeMaps & Red-Black Trees',
    filename: 'Section20_Deep+dive+on+Map,+HashMap,+TreeMap,+LinkedHashMap.pdf',
    module: 'Maps, Sets & Sorting',
    format: 'PDF',
    estimatedMinutes: 40,
    description: [
      'In-depth analysis of Key-Value data mapping and the internal architecture of HashMap.',
      'Explains hash collisions, linked buckets, and Java 8\'s treeification into Red-Black trees.',
      'Compares HashMap performance against TreeMap (O(log n) sorted) and LinkedHashMap (LRU caches).',
      'A cornerstone topic in advanced Java evaluations, caching problems, and frequency counting.'
    ]
  },
  {
    id: 'doc-23',
    sequence: 23,
    title: 'Set Interface, HashSets & TreeSets',
    filename: 'Section21_Set,+HashSet,+TreeSet,+LinkedHashSet.pdf',
    module: 'Maps, Sets & Sorting',
    format: 'PDF',
    estimatedMinutes: 30,
    description: [
      'Covers the Set interface contract ensuring mathematical uniqueness with zero duplicate elements.',
      'Details HashSet hashing mechanics and bucket indexing via hashCode() and equals().',
      'Contrasts HashSet (unordered), LinkedHashSet (insertion order), and TreeSet (sorted order).',
      'Indispensable for deduplicating data streams and O(1) membership testing in exams.'
    ]
  },
  {
    id: 'doc-24',
    sequence: 24,
    title: 'Set Operations Code & Mathematical Algorithms',
    filename: 'Set Interface example programs.docx',
    module: 'Maps, Sets & Sorting',
    format: 'DOCX',
    estimatedMinutes: 15,
    description: [
      'Collection of executable Java programs demonstrating real-world Set manipulation.',
      'Shows mathematical set operations: union (addAll), intersection (retainAll), and difference (removeAll).',
      'Demonstrates word frequency extraction and unique token harvesting from raw text inputs.',
      'Provides ready-to-adapt code snippets for competitive exam string and set challenges.'
    ]
  },
  {
    id: 'doc-25',
    sequence: 25,
    title: 'Object Ordering: Comparable vs Comparator',
    filename: 'comparable and comparator.docx',
    module: 'Maps, Sets & Sorting',
    format: 'DOCX',
    estimatedMinutes: 20,
    description: [
      'Details natural ordering with Comparable<T> and implementing the compareTo() method.',
      'Explains customized external sorting with Comparator<T> and the compare() method.',
      'Demonstrates multi-field sorting pipelines (e.g. sort by GPA descending, then Name ascending).',
      'Directly essential for sorting custom objects in arrays, lists, and TreeSets in lab tests.'
    ]
  },

  // Module 9: Modern Java & Concurrency
  {
    id: 'doc-26',
    sequence: 26,
    title: 'Modern Date & Time API (java.time)',
    filename: 'Section23_Date+and+Time+in+Java.pdf',
    module: 'Modern Java & Concurrency',
    format: 'PDF',
    estimatedMinutes: 25,
    description: [
      'Explores Java 8\'s immutable, thread-safe java.time package replacing legacy java.util.Date.',
      'Teaches LocalDate, LocalTime, LocalDateTime, and timezone handling with ZonedDateTime.',
      'Covers string parsing, formatting with DateTimeFormatter, and calculating Period and Duration.',
      'Required for modern enterprise applications and portal questions calculating calendar days.'
    ]
  },
  {
    id: 'doc-27',
    sequence: 27,
    title: 'Multithreading, Lifecycle & Synchronization',
    filename: 'Java+Threads.pptx',
    module: 'Modern Java & Concurrency',
    format: 'PPTX',
    estimatedMinutes: 35,
    description: [
      'Introduces concurrent programming: Thread class extension versus Runnable interface implementation.',
      'Explains thread lifecycle states: New, Runnable, Blocked, Waiting, Timed_Waiting, and Terminated.',
      'Demonstrates race condition prevention using the synchronized keyword and critical sections.',
      'Capstone topic representing advanced Java proficiency in university operating systems & Java exams.'
    ]
  }
];

function getCurriculum() {
  const webPdfDir = path.join(documentsDir, 'web_pdf');
  return curriculumList.map(item => {
    const fullPath = path.join(documentsDir, item.filename);
    const companionPath = path.join(webPdfDir, `${item.filename}.pdf`);
    const hasWebPdf = item.format === 'PDF' || fs.existsSync(companionPath);

    let sizeBytes = 0;
    try {
      const stat = fs.statSync(fullPath);
      sizeBytes = stat.size;
    } catch {}

    return {
      ...item,
      sizeBytes,
      sizeFormatted: sizeBytes > 1024 * 1024 
        ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(sizeBytes / 1024)} KB`,
      hasWebPdf,
      viewUrl: `/api/documents/view/${encodeURIComponent(item.filename)}`,
      rawUrl: `/api/documents/raw/${encodeURIComponent(item.filename)}`
    };
  });
}

module.exports = {
  documentsDir,
  getCurriculum
};
