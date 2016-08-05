-- phpMyAdmin SQL Dump
-- version 4.0.10deb1
-- http://www.phpmyadmin.net
--
-- Máquina: 127.0.0.1
-- Data de Criação: 05-Ago-2016 às 02:06
-- Versão do servidor: 5.5.49-0ubuntu0.14.04.1
-- versão do PHP: 5.5.9-1ubuntu4.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de Dados: `c9`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `alergias`
--

CREATE TABLE IF NOT EXISTS `alergias` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `amendoin` tinyint(1) NOT NULL DEFAULT '0',
  `camarão` tinyint(1) NOT NULL DEFAULT '0',
  `leite` tinyint(1) NOT NULL DEFAULT '0',
  `ovo` tinyint(1) NOT NULL DEFAULT '0',
  `soja` tinyint(1) NOT NULL DEFAULT '0',
  `trigo` tinyint(1) NOT NULL DEFAULT '0',
  `penicilina` tinyint(1) NOT NULL DEFAULT '0',
  `amoxicilina` tinyint(1) NOT NULL DEFAULT '0',
  `dipirona` tinyint(1) NOT NULL DEFAULT '0',
  `gluten` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `penicilina` (`penicilina`),
  KEY `penicilina_2` (`penicilina`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- Extraindo dados da tabela `alergias`
--

INSERT INTO `alergias` (`id`, `amendoin`, `camarão`, `leite`, `ovo`, `soja`, `trigo`, `penicilina`, `amoxicilina`, `dipirona`, `gluten`) VALUES
(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1),
(2, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0),
(3, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0),
(4, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0),
(5, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0),
(6, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0),
(17, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0),
(19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(21, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(22, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(25, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(26, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0),
(27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
(28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `categoria` varchar(50) NOT NULL DEFAULT 'pessoa-fisica',
  `idAlergias` int(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `chave estrangeira` (`idAlergias`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=18 ;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `categoria`, `idAlergias`) VALUES
(1, 'daniel', 'd@test.com', 'abcd', 'pessoa-fisica', 1),
(2, 'jhon', 'jhon@test.com', 'abcd', 'pessoa-fisica', 2),
(3, 'joe', 'joe@test.com', 'abcd', 'pessoa-fisica', 3),
(4, 'roy', 'r@test.com', 'abcd', 'pessoa-fisica', 4),
(5, 'anon', 'anon@test.com', 'abcd', 'pessoa-fisica', 5),
(6, 'whatever', 'whatever', 'abcd', 'pessoa-fisica', 6),
(7, 'abcd', 'abcd', 'abcd', 'pessoa-fisica', 17),
(8, 'danield''oliveir', 'danield''oliveir', 'daniel', 'pessoa-fisica', 19),
(9, 'abc', 'abc', 'abc', 'pessoa-fisica', 20),
(10, 'joana', 'joana', 'joana', 'pessoa-fisica', 21),
(11, 'carlos', 'carlos', 'carlos', 'pessoa-fisica', 22),
(14, 'sant''ana', 'santana', 'santana', 'pessoa-fisica', 25),
(15, 'drax', 'draxdeveloper@gmail.com', 'teste', 'pessoa-fisica', 26),
(16, 'test2', 'test2', 'test2', 'empresa', 28);

--
-- Constraints for dumped tables
--

--
-- Limitadores para a tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `possui` FOREIGN KEY (`idAlergias`) REFERENCES `alergias` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
